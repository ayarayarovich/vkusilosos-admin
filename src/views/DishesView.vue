<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Dish } from '@/interfaces'
import { useDebounce } from '@vueuse/core'

import { CreateDish, DeleteDish, UpdateDish } from '@/features/dishes'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const searchTerm = ref('')
const selectedDish = ref<Dish>()
const debouncedSearchTerm = useDebounce(searchTerm, 500)
const totalRecords = ref<number>()

const query = reactive(
  useQuery({
    queryKey: ['dishes', { offset, limit, searchTerm: debouncedSearchTerm }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/dishes', {
        params: {
          offset: (queryKey[1] as any).offset as number,
          limit: (queryKey[1] as any).limit as number,
          search: (queryKey[1] as any).searchTerm as string
        }
      })
      return response.data
    },
    placeholderData: (previousData: any) => previousData
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
const beginCreateDishInteraction = () => {
  dialog.open(CreateDish, {
    props: {
      class: 'w-full max-w-4xl',
      modal: true,
      header: 'Новое блюдо'
    } as any
  })
}
const beginUpdateDishInteraction = (dish: Dish) => {
  dialog.open(UpdateDish, {
    props: {
      class: 'w-full max-w-4xl',
      modal: true,
      header: 'Изменить блюдо'
    } as any,
    data: {
      dish
    }
  })
}

const beginDeleteDishInteraction = (dish: Dish) => {
  dialog.open(DeleteDish, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Изменить блюдо'
    } as any,
    data: {
      dish
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
    command: () => beginCreateDishInteraction()
  },
  {
    label: 'Изменить',
    icon: 'pi pi-fw pi-pencil',
    command: () => beginUpdateDishInteraction(selectedDish.value!)
  },
  {
    label: 'Удалить',
    icon: 'pi pi-fw pi-times',
    command: () => beginDeleteDishInteraction(selectedDish.value!)
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
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Блюда</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedDish = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="query.isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateDishInteraction()" />
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
              :disabled="!selectedDish"
              @click="beginUpdateDishInteraction(selectedDish!)"
            />
            <Button
              :disabled="!selectedDish"
              icon="pi pi-times"
              severity="danger"
              @click="beginDeleteDishInteraction(selectedDish!)"
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
        v-model:selection="selectedDish"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedDish"
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
        <Column field="img" header="Картинка">
          <template #body="slotProps">
            <img
              :src="slotProps.data.img"
              :alt="slotProps.data.img"
              class="h-16 drop-shadow-md rounded-lg"
            />
          </template>
        </Column>
        <Column field="price" header="Цена" />
        <Column field="sale_price" header="Цена продажи" />

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
