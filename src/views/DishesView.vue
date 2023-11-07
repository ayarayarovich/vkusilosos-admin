<script setup lang="ts">
import { ref, reactive, toRefs, watch } from 'vue'
import type { DataTablePageEvent, DataTableRowEditSaveEvent } from 'primevue/datatable'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'
import CreateDish from '@/components/CreateDish.vue'

import type { Dish } from '@/interfaces'
import { useDebounce, useElementBounding } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import UpdateDish from '@/components/UpdateDish.vue'
import DeleteDish from '@/components/DeleteDish.vue'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const searchTerm = ref('')
const selectedDish = ref<Dish>()
const debouncedSearchTerm = useDebounce(searchTerm, 500)
const totalRecords = ref<number>()

const queryClient = useQueryClient()
const toast = useToast()

const query = reactive(
  useQuery({
    queryKey: ['dishes', { offset, limit, searchTerm: debouncedSearchTerm }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/dishes', {
        params: {
          offset: (queryKey[1] as any).offset as number,
          limit: (queryKey[1] as any).limit as number,
          search: (queryKey[1] as any).searchTerm as string
        }
      })
      return response.data
    },
    placeholderData: (previousData: any) => previousData,
  })
)

watch([query], () => {
  if (query.data) {
    totalRecords.value = query.data.total
  }
})

const mutateDishQuery = reactive(
  useMutation({
    mutationFn: async (payload: any) => await axiosPrivate.put('admin/dish', payload),
    onSuccess(data, variables) {
      queryClient.invalidateQueries(['dishes'])
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Данные блюда (id = ${variables.id}) обновлены`
      })
    },
    onError(error: any) {
      const body = error.response.data
      if (error.response.status === 400) {
        toast.add({
          severity: 'error',
          life: 3000,
          summary: body.message
        })
      }
    }
  })
)

const onPage = (e: DataTablePageEvent) => {
  offset.value = e.first
  limit.value = e.rows
}

const onSort = (e: any) => {
  console.log('onSort', e)
}

const onUpload = (e: any) => {
  console.log('onUpload', e)
}

const heading = ref()

const headingBounding = useElementBounding(heading)

const onRowEditSave = (a: DataTableRowEditSaveEvent) => {
  mutateDishQuery.mutate(a.newData)
}
</script>

<template>
  <main class="mx-4 h-screen flex flex-col items-stretch">
    <div class="h-24 flex items-center justify-between" ref="heading">
      <h1 class="text-3xl font-semibold leading-none">Блюда</h1>
      <CreateDish />
    </div>

    <div>
      <Message v-if="query.isError" severity="error" :closable="false"
        >Не удалось загрузить таблицу</Message
      >
      <DataTable
        v-else
        size="small"
        scrollable
        :scroll-height="`calc(100vh - ${headingBounding.height.value + 250}px)`"
        v-model:selection="selectedDish"
        selection-mode="single"
        :meta-key-selection="false"
        class="rounded-xl grow overflow-hidden mt-6"
        :value="query.data?.items"
        lazy
        paginator
        :first="0"
        :rows="rowsPerPage"
        dataKey="id"
        tableStyle="min-width: 50rem"
        @page="onPage($event)"
        :totalRecords="totalRecords"
        :loading="query.isLoading"
      >
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="id" header="ID" />
        <Column field="name" header="Название" />
        <Column field="img" header="Картинка">
          <template #body="slotProps">
            <img
              :src="slotProps.data.img"
              :alt="slotProps.data.img"
              class="h-16 drop-shadow-md rounded-lg"
            />
          </template>
        </Column>
        <Column field="price" header="Цена" />
        <Column field="sale_price" header="Цена продажи" />
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <Button
                icon="pi pi-refresh"
                :disabled="query.isFetching"
                @click="queryClient.invalidateQueries(['dishes'])"
              />
            </div>

            <div class="flex gap-4">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchTerm" placeholder="Поиск" />
              </span>
              <UpdateDish :disabled="!selectedDish" :dish="selectedDish" />
              <DeleteDish :disabled="!selectedDish" :dish="selectedDish" />
            </div>
          </div>
        </template>

        <template #loading>
          <ProgressSpinner class="h-8" />
        </template>
      </DataTable>
    </div>
  </main>
</template>
