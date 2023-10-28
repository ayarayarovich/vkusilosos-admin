<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { useDebounce, useElementBounding } from '@vueuse/core'
import { axiosPrivate } from '@/network'

import type { User } from '@/interfaces'
import BlockUnblockUser from '@/components/BlockUnblockUser.vue'
import { useTableSelectionStore } from '@/stores/table-selection-store'
import GiftBonusesToUser from '@/components/GiftBonusesToUser.vue'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const searchTerm = ref('')
const debouncedSearchTerm = useDebounce(searchTerm, 500)

const tableSelectionStore = useTableSelectionStore()
const selectedUser = ref()

watch([selectedUser], () => {
  if (selectedUser.value) {
    tableSelectionStore.id = selectedUser.value.id
    tableSelectionStore.name = selectedUser.value.name
  }
})

const query = reactive(
  useQuery<{
    items: User[]
    total: number
  }>({
    queryKey: ['users', offset, limit, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/users', {
        params: {
          offset: queryKey[1] as number,
          limit: queryKey[2] as number,
          search: queryKey[3] as number
        }
      })
      return response.data;
    }
  })
)

const onPage = (e: DataTablePageEvent) => {
  offset.value = e.first
  limit.value = e.rows
}

const heading = ref()
const headingBounding = useElementBounding(heading)
</script>

<template>
  <main class="mx-4 min-h-full flex flex-col items-stretch">
    <div class="h-24 flex items-center justify-between" ref="heading">
      <h1 class="text-3xl font-semibold leading-none">Пользователи</h1>
    </div>
    <div>
      <Message v-if="query.isError" severity="error" :closable="false"
        >Не удалось загрузить таблицу</Message
      >
      <DataTable
        v-else
        size="small"
        class="rounded-xl grow overflow-hidden mt-6"
        scrollable
        :scroll-height="`calc(100vh - ${headingBounding.height.value + 250}px)`"
        v-model:selection="selectedUser"
        selection-mode="single"
        :meta-key-selection="false"
        :value="query.data?.items"
        lazy
        paginator
        :first="0"
        :rows="rowsPerPage"
        dataKey="id"
        tableStyle="min-width: 50rem"
        @page="onPage($event)"
        :totalRecords="query.data?.total"
        :loading="query.isLoading"
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Имя" />
        <Column field="surname" header="Фамилия" />
        <Column field="phone" header="Телефон" />
        <Column field="role" header="Роль" />
        <Column field="status" header="Статус" />
        <Column field="tolal_order" header="Сумма чеков" />
        <Column field="bonuses" header="Бонусы" />

        <template #header>
          <div class="flex justify-end gap-4">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="searchTerm" placeholder="Поиск" />
            </span>

            <BlockUnblockUser :disabled="!selectedUser" />
            <GiftBonusesToUser :disabled="!selectedUser" />
          </div>
        </template>

        <template #loading>
          <ProgressSpinner class="h-8" />
        </template>
      </DataTable>
    </div>
  </main>
</template>
