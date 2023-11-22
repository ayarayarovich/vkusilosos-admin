<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import { CreateStory } from '@/features/stories'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selectedStory = ref<any>()
const totalRecords = ref<number>()

const query = reactive(
  useQuery<{
    items: any
    total: number
  }>({
    queryKey: ['categories', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/categories', {
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

const dialog = useDialog()

const beginCreateStoryInteraction = () => {
  dialog.open(CreateStory, {
    props: {
      class: 'max-w-4xl w-full',
      modal: true,
      header: 'Новая история'
    } as any
  })
}

const refresh = () => {
  query.refetch()
}

const cm = ref()
const onRowContextMenu = (event: any) => {
  cm.value.show(event.originalEvent)
}
const menuModel = ref([
  {
    label: 'Обновить',
    icon: 'pi pi-fw pi-refresh',
    command: () => refresh()
  },
  {
    label: 'Создать',
    icon: 'pi pi-fw pi-plus',
    command: () => beginCreateStoryInteraction()
  }
])

const root = ref<HTMLElement>()
const scrollHeight = ref()
onMounted(() => {
  if (root.value) {
    const pagginatorHeight = root.value.querySelector('.p-paginator-bottom')?.clientHeight
    scrollHeight.value = `calc(100% - ${pagginatorHeight}px)`
  }
})
</script>

<template>
  <main class="px-4 h-screen flex flex-col items-stretch" ref="root">
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Истории</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedStory = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="query.isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateStoryInteraction()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <!-- <Button
              icon="pi pi-pencil"
              :disabled="!selectedStory"
              @click="beginUpdateCategoryInteraction(selectedStory!)"
            />
            <Button
              :disabled="!selectedStory"
              icon="pi pi-times"
              severity="danger"
              @click="beginDeleteCategoryInteraction(selectedStory!)"
            /> -->
          </div>
        </div>
      </template>
    </Toolbar>

    <strong class="mt-6 text-center text-red-500">Табличка пока левая</strong>

    <div class="flex-1 min-h-0 py-6">
      <Message v-if="query.isError" severity="error" :closable="false"
        >Не удалось загрузить таблицу</Message
      >
      <DataTable
        v-else
        size="small"
        scrollable
        :scroll-height="scrollHeight"
        v-model:selection="selectedStory"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedStory"
        @rowContextmenu="onRowContextMenu"
        :meta-key-selection="false"
        class="border rounded-lg h-full overflow-hidden"
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
        <Column field="name" header="Название" />
        <Column field="count_dishes" header="Количество блюд" />

        <template #loading>
          <ProgressSpinner class="h-8" />
        </template>
        <template #empty>
          <div class="py-12 flex flex-col items-center gap-4">
            <img class="h-36" src="/empty.svg" alt="" />
            <span>Нет данных</span>
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>
