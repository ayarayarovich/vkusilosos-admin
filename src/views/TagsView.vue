<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Tag } from '@/interfaces'
import CreateTag from '@/components/CreateTag.vue'
import { useElementBounding } from '@vueuse/core'
import DeleteTag from '@/components/DeleteTag.vue'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selectedTag = ref<Tag>()
const expandedRows = ref<Tag[]>()
const totalRecords = ref<number>()

const queryClient = useQueryClient()

const query = reactive(
  useQuery<{
    items: Tag[]
    total: number
  }>({
    queryKey: ['tags', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/tag', {
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
      <h1 class="text-3xl font-semibold leading-none">Теги</h1>
      <CreateTag />
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
        v-model:selection="selectedTag"
        v-model:expandedRows="expandedRows"
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
        <Column expander style="width: 5rem" />
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="id" header="ID" />
        <Column field="name" header="Название" />
        <Column field="count_dishes" header="Количество блюд" />
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <Button
                icon="pi pi-refresh"
                :disabled="query.isFetching"
                @click="queryClient.invalidateQueries(['tags'])"
              />
            </div>

            <div class="flex gap-4">
              <DeleteTag :disabled="!selectedTag" :tag="selectedTag" />
            </div>
          </div>
        </template>

        <template #loading>
          <ProgressSpinner class="h-8" />
        </template>

        <template #expansion="slotProps">
          <div class="p-3">
            <h5>Список блюд для тега {{ slotProps.data.name }}</h5>
            <DataTable :value="slotProps.data.dishes">
              <Column field="id" header="ID"></Column>
              <Column field="name" header="Название"></Column>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>
