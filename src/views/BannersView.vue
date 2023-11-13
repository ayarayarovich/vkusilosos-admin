<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'
import { useElementBounding } from '@vueuse/core'

import CreateBanner from '@/components/CreateBanner.vue'
import DeleteBanner from '@/components/DeleteBanner.vue'


const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selectedBanner = ref()
const totalRecords = ref<number>()

const queryClient = useQueryClient()

const query = reactive(
  useQuery<{
    items: any[]
    total: number
  }>({
    queryKey: ['banners', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/banner', {
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
      <h1 class="text-3xl font-semibold leading-none text-black">Баннеры</h1>
      <CreateBanner />
    </div>

    <div>
      <Message v-if="query.isError" severity="error" :closable="false">
        Не удалось загрузить таблицу
      </Message>
      <DataTable
        v-else
        size="small"
        scrollable
        :scroll-height="`calc(100vh - ${headingBounding.height.value + 250}px)`"
        v-model:selection="selectedBanner"
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
      >
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="id" header="ID" />
        <Column field="img" header="Баннер">
          <template #body="slotProps">
            <Image :src="slotProps.data.img" :alt="slotProps.data.img" preview />
          </template>
        </Column>
        <Column field="acc_id" header="ID акции" />
        <Column field="active" header="Состояние">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.active" value="Активно" severity="success" />
            <Tag v-else value="Не активно" severity="danger" />
          </template>
        </Column>
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <Button
                icon="pi pi-refresh"
                :disabled="query.isFetching"
                @click="queryClient.invalidateQueries(['banners'])"
              />
            </div>

            <div class="flex gap-4">
              <DeleteBanner :disabled="!selectedBanner" :banner="selectedBanner" />
            </div>
          </div>
        </template>

        <template #loading>
          <ProgressSpinner class="h-8" />
        </template>
        <template #empty>
          <div class="py-12 flex flex-col items-center gap-4">
            <img class="h-36" src="/empty.svg" alt="">
            <span>Нет данных</span>
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>
