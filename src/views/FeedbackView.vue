<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Feedback } from '@/interfaces'

const expandedRows = ref<any[]>([])

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage

const getFeedbacksQuery = reactive(
  useQuery<{
    items: Feedback[]
    total: number
  }>({
    queryKey: ['feedbacks', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/reviews', {
        params: {
          offset: (queryKey[1] as any).offset as number,
          limit: (queryKey[1] as any).limit as number
        }
      })
      return response.data
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
</script>

<template>
  <main class="mx-4 min-h-full flex flex-col items-stretch">
    <div class="h-24 flex items-center justify-between">
      <h1 class="text-3xl font-semibold leading-none">Отзывы</h1>
    </div>

    <Message v-if="getFeedbacksQuery.isError" severity="error" :closable="false"
      >Не удалось загрузить таблицу</Message
    >
    <DataTable
      v-else
      size="small"
      class="rounded-xl grow overflow-hidden mt-6"
      tableClass="editable-cells-table"
      tableStyle="min-width: 50rem"
      editMode="row"
      v-model:expanded-rows="expandedRows"
      @page="onPage($event)"
      :value="getFeedbacksQuery.data?.items"
      dataKey="id"
      lazy
      paginator
      :first="0"
      :rows="rowsPerPage"
      :totalRecords="getFeedbacksQuery.data?.total"
      :loading="getFeedbacksQuery.isLoading"
    >
      <Column expander class="w-12"></Column>
      <Column field="id" header="ID"></Column>
      <Column field="text" header="Текст">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="status" header="Статус">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></Column>

      <template #expansion="slotProps">
        <div class="p-3">
          <h5>Пользователь {{ slotProps.data.user.name }}</h5>
          <DataTable :value="[slotProps.data.user]">
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Имя" sortable></Column>
          </DataTable>
        </div>
      </template>

      <template #loading>
        <ProgressSpinner class="h-8" />
      </template>
    </DataTable>
  </main>
</template>
