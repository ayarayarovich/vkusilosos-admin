<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Tag } from '@/interfaces'
import { CreateTag, DeleteTag } from '@/features/tags'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selectedTag = ref<Tag>()
const expandedRows = ref<Tag[]>()
const totalRecords = ref<number>()

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

const dialog = useDialog()
const beginCreateTagInteraction = () => {
  dialog.open(CreateTag, {
    props: {
      class: 'w-full max-w-4xl',
      modal: true,
      header: 'Новый тег'
    } as any
  })
}

const beginDeleteTagInteraction = (tag: Tag) => {
  dialog.open(DeleteTag, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Удалить тег'
    } as any,
    data: {
      tag
    }
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
    command: () => beginCreateTagInteraction()
  },
  {
    label: 'Удалить',
    icon: 'pi pi-fw pi-times',
    command: () => beginDeleteTagInteraction(selectedTag.value!)
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
  <main class="mx-4 h-screen flex flex-col items-stretch" ref="root">
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Теги</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedTag = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex gap-2">
            <Button icon="pi pi-refresh" :disabled="query.isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateTagInteraction()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <Button
              :disabled="!selectedTag"
              icon="pi pi-times"
              severity="danger"
              @click="beginDeleteTagInteraction(selectedTag!)"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <div class="flex-1 min-h-0 py-6">
      <Message v-if="query.isError" severity="error" :closable="false"
        >Не удалось загрузить таблицу</Message
      >
      <DataTable
        v-else
        size="small"
        scrollable
        :scroll-height="scrollHeight"
        v-model:selection="selectedTag"
        v-model:expandedRows="expandedRows"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedTag"
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
        <Column expander style="width: 3rem" />
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

        <template #expansion="slotProps">
          <div class="p-3">
            <h5>Список блюд для тега {{ slotProps.data.name }}</h5>
            <DataTable :value="slotProps.data.dishes">
              <Column field="id" header="ID"></Column>
              <Column field="name" header="Название"></Column>

              <template #empty>
                <div class="py-4 flex flex-col items-center gap-4">
                  <img class="h-16" src="/empty.svg" alt="" />
                  <span>Нет данных</span>
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>
  </main>
</template>
