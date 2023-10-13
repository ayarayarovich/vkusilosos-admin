<script setup lang="ts">
import { ref, reactive, toRefs, watch } from 'vue'
import type { DataTablePageEvent, DataTableRowEditSaveEvent } from 'primevue/datatable'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import ky from '@/network'
import CreateDish from '@/components/CreateDish.vue'

import type { Dish } from '@/interfaces'
import { useDebounce, useElementBounding } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import UpdateDish from '@/components/UpdateDish.vue'
import DeleteDish from '@/components/DeleteDish.vue'
import { useTableSelectionStore } from '@/stores/table-selection-store'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const searchTerm = ref('')
const selectedDish = ref<Dish>()
const debouncedSearchTerm = useDebounce(searchTerm, 500)
const totalRecords = ref<number>()

const queryClient = useQueryClient()
const toast = useToast()
const tableSelectionStore = useTableSelectionStore()

watch([selectedDish], () => {
  if (selectedDish.value) {
    tableSelectionStore.id = selectedDish.value.id
    tableSelectionStore.name = selectedDish.value.name
  }
})

const query = reactive(
  useQuery<{
    items: Dish[]
    total: number
  }>({
    queryKey: ['dishes', offset, limit, debouncedSearchTerm],
    queryFn: ({ queryKey }) =>
      ky
        .get('admin/dishes', {
          searchParams: {
            offset: queryKey[1] as number,
            limit: queryKey[2] as number,
            search: queryKey[3] as number
          }
        })
        .json()
  })
)

const { data } = toRefs(query)

watch([data], () => {
  totalRecords.value = data.value?.total
})

const mutateDishQuery = reactive(
  useMutation({
    mutationFn: (payload: any) => ky.put('admin/dish', { json: payload }).json(),
    onSuccess(data, variables) {
      queryClient.invalidateQueries(['dishes'])
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Данные блюда (id = ${variables.id}) обновлены`
      })
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Что-то пошло не так...'
      })
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
        <Column selectionMode="single" headerStyle="width: 3rem"></Column>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Название">
        </Column>
        <Column field="img" header="Картинка">
          <template #body="slotProps">
            <img
              :src="slotProps.data.img"
              :alt="slotProps.data.img"
              class="h-16 drop-shadow-md rounded-lg"
            />
          </template>
        </Column>
        <Column field="price" header="Цена">
        </Column>
        <Column field="sale_price" header="Цена продажи"/>
        <template #header>
          <div class="flex gap-4 justify-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="searchTerm" placeholder="Поиск" />
            </span>

            <UpdateDish :disabled="!selectedDish" />
            <DeleteDish :disabled="!selectedDish" />
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>