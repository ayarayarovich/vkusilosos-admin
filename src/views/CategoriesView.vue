<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import type { ICategory } from '@/features/categories'
import { CreateCategory, DeleteCategory, UpdateCategory } from '@/features/categories'
import { useDialog } from 'primevue/usedialog'
import { useCategories } from '@/features/categories/composables'
import { useDebounce } from '@vueuse/core'

const initialRowsPerPage = 20

const offset = ref(0)
const limit = ref(initialRowsPerPage)
const selectedCategory = ref<ICategory>()
const searchTerm = ref('')
const debouncedSearchTerm = useDebounce(searchTerm, 500)

const { data, isFetching, isError, refetch } = useCategories(
  { offset, limit, search: debouncedSearchTerm },
  (v) => v
)

const onPage = (e: DataTablePageEvent) => {
  offset.value = e.first
  limit.value = e.rows
}

const dialog = useDialog()

const beginCreateCategoryInteraction = () => {
  dialog.open(CreateCategory, {
    props: {
      class: 'max-w-xl w-full',
      modal: true,
      header: 'Новая категория'
    } as any
  })
}

const beginDeleteCategoryInteraction = (category: ICategory) => {
  dialog.open(DeleteCategory, {
    props: {
      class: 'max-w-xl w-full',
      modal: true,
      header: 'Подтвердите удаление'
    } as any,
    data: {
      category
    },
    onClose: () => {
      selectedCategory.value = undefined
    }
  })
}

const beginUpdateCategoryInteraction = (category: ICategory) => {
  dialog.open(UpdateCategory, {
    props: {
      class: 'max-w-xl w-full',
      modal: true,
      header: 'Изменить категорию'
    } as any,
    data: {
      category
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
    command: () => beginCreateCategoryInteraction()
  },
  {
    label: 'Изменить',
    icon: 'pi pi-fw pi-pencil',
    command: () => beginUpdateCategoryInteraction(selectedCategory.value!)
  },
  {
    label: 'Удалить',
    icon: 'pi pi-fw pi-times',
    command: () => beginDeleteCategoryInteraction(selectedCategory.value!)
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
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Категории</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedCategory = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateCategoryInteraction()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <Button
              icon="pi pi-pencil"
              :disabled="!selectedCategory"
              @click="beginUpdateCategoryInteraction(selectedCategory!)"
            />
            <Button
              :disabled="!selectedCategory"
              icon="pi pi-times"
              severity="danger"
              @click="beginDeleteCategoryInteraction(selectedCategory!)"
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
        size="small"
        scrollable
        :scroll-height="scrollHeight"
        v-model:selection="selectedCategory"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedCategory"
        @rowContextmenu="onRowContextMenu"
        :meta-key-selection="false"
        class="border rounded-lg h-full overflow-hidden"
        :value="data?.list"
        lazy
        paginator
        :first="0"
        :rows="initialRowsPerPage"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        dataKey="id"
        tableStyle="min-width: 50rem"
        @page="onPage($event)"
        :totalRecords="data?.total"
      >
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="id" header="ID" />
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
      </DataTable>
    </div>
  </main>
</template>
