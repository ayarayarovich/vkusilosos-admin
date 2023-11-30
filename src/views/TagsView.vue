<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import { CreateTag, DeleteTag, useTags, type ITag } from '@/features/tags'
import { useDialog } from 'primevue/usedialog'
import { useDebounce } from '@vueuse/core'
import UpdateTag from '@/features/tags/UpdateTag.vue'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selectedTag = ref<ITag>()

const searchTerm = ref('')
const debouncedSearchTerm = useDebounce(searchTerm, 500)

const { data, refetch, isFetching, isError } = useTags(
  {
    limit,
    offset,
    search: debouncedSearchTerm
  },
  (r) => r
)

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

const beginDeleteTagInteraction = (tag: ITag) => {
  dialog.open(DeleteTag, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Удалить тег'
    } as any,
    data: {
      tag
    },
    onClose: () => {
      selectedTag.value = undefined
    }
  })
}

const beginUpdateTagInteraction = (tag: ITag) => {
  dialog.open(UpdateTag, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Изменить тег'
    } as any,
    data: {
      tag
    }
  })
}

const refresh = () => {
  refetch()
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
    label: 'Изменить',
    icon: 'pi pi-fw pi-pencil',
    command: () => beginUpdateTagInteraction(selectedTag.value!)
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
  <main class="px-4 h-screen flex flex-col items-stretch" ref="root">
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Теги</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedTag = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex gap-2">
            <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateTagInteraction()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" v-model="searchTerm" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <Button
              icon="pi pi-pencil"
              :disabled="!selectedTag"
              @click="beginUpdateTagInteraction(selectedTag!)"
            />
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
      <Message v-if="isError" severity="error" :closable="false"
        >Не удалось загрузить таблицу</Message
      >
      <DataTable
        v-else
        column-resize-mode="expand"
        size="small"
        scrollable
        :scroll-height="scrollHeight"
        v-model:selection="selectedTag"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedTag"
        @rowContextmenu="onRowContextMenu"
        :meta-key-selection="false"
        class="border rounded-lg h-full overflow-hidden"
        :value="data?.list"
        lazy
        paginator
        :first="0"
        :rows="rowsPerPage"
        dataKey="ID"
        tableStyle="min-width: 50rem"
        @page="onPage($event)"
        :totalRecords="data?.total"
      >
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="ID" header="ID" />
        <Column field="img" header="Картинка">
          <template #body="slotProps">
            <img
              :src="slotProps.data.img"
              alt=""
              class="h-16 aspect-square drop-shadow-md rounded-md"
            />
          </template>
        </Column>
        <Column field="name" header="Название" />
        
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
