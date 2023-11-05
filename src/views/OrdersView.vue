<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Restaurant } from '@/interfaces'
import { useElementBounding } from '@vueuse/core'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selected = ref()
const totalRecords = ref<number>()

const queryClient = useQueryClient()

const query = reactive(
  useQuery<{
    items: any[]
    total: number
  }>({
    queryKey: ['orders', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/orders', {
        params: {
          offset: (queryKey[1] as any).offset as number,
          limit: (queryKey[1] as any).limit as number
        }
      })
      return response.data
    }
  })
)

watch([query], () => {
  if (query.data) {
    totalRecords.value = query.data.total
  }
})

const onPage = (e: DataTablePageEvent) => {
  offset.value = e.first
  limit.value = e.rows
}

const heading = ref()

const headingBounding = useElementBounding(heading)
</script>

<template>
  <main class="mx-4 h-screen flex flex-col items-stretch">
    <div class="h-24 flex items-center justify-between" ref="heading">
      <h1 class="text-3xl font-semibold leading-none">Заказы</h1>
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
        v-model:selection="selected"
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
        <Column field="user_name" header="Имя пользователя" />
        <Column field="phone" header="Телефон" />
        <Column field="total_price" header="Сумма" />
        <Column field="count_items" header="Количество позиций" />
        <Column field="create_time" header="Дата создания" />
        <Column field="status" header="Статус" />
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <Button
                icon="pi pi-refresh"
                :disabled="query.isFetching"
                @click="queryClient.invalidateQueries(['rests'])"
              />
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
