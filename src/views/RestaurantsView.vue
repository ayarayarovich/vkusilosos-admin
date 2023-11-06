<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Restaurant } from '@/interfaces'
import UpdateCategory from '@/components/UpdateCategory.vue'
import { useElementBounding } from '@vueuse/core'
import emitter from '@/emmiter'
import CreateRestaurant from '@/components/CreateRestaurant.vue'
import UpdateRestaurant from '@/components/UpdateRestaurant.vue'
import DeleteRestaurant from '@/components/DeleteRestaurant.vue'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selectedRestaurant = ref<Restaurant>()
const totalRecords = ref<number>()

const queryClient = useQueryClient()

const query = reactive(
  useQuery<{
    items: Restaurant[]
    total: number
  }>({
    queryKey: ['rests', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/rests', {
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
      <h1 class="text-3xl font-semibold leading-none">Рестораны</h1>
      <CreateRestaurant />
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
        v-model:selection="selectedRestaurant"
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
        <Column field="address" header="Адрес" />
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <Button
                icon="pi pi-refresh"
                :disabled="query.isFetching"
                @click="queryClient.invalidateQueries(['rests'])"
              />
            </div>

            <div class="flex gap-4">
              <Button
                label="Изменить"
                icon="pi pi-external-link"
                :disabled="!selectedRestaurant"
                @click="
                  emitter.emit('Restaurants.Edit', {
                    id: selectedRestaurant!.id,
                    name: selectedRestaurant!.name
                  })
                "
              />
              <UpdateRestaurant />
              <DeleteRestaurant :disabled="!selectedRestaurant" :restaurant="selectedRestaurant" />
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
