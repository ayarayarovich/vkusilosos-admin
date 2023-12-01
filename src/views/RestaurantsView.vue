<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import {
  CreateRestaurant,
  DeleteRestaurant,
  UpdateRestaurant,
  useRestaurants,
  type IRestaurant
} from '@/features/restaurants'
import { useDialog } from 'primevue/usedialog'
import { useDebounce } from '@vueuse/core'
import dateFormat from 'dateformat'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selectedRestaurant = ref<IRestaurant>()

const { data, refetch, isFetching, isError } = useRestaurants(
  {
    limit,
    offset,
    search: debouncedSearch
  },
  (v) => v
)

const onPage = (e: DataTablePageEvent) => {
  offset.value = e.first
  limit.value = e.rows
}

const dialog = useDialog()
const beginCreateRestaurantInteraction = () => {
  dialog.open(CreateRestaurant, {
    props: {
      class: 'w-full max-w-4xl',
      modal: true,
      header: 'Новый ресторан'
    } as any
  })
}
const beginUpdateRestaurantInteraction = (restaurant: IRestaurant) => {
  dialog.open(UpdateRestaurant, {
    props: {
      class: 'w-full max-w-4xl',
      modal: true,
      header: 'Изменить ресторан'
    } as any,
    data: {
      restaurant
    }
  })
}

const beginDeleteRestaurantInteraction = (restaurant: IRestaurant) => {
  dialog.open(DeleteRestaurant, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Удалить ресторан'
    } as any,
    data: {
      restaurant
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
    command: () => beginCreateRestaurantInteraction()
  },
  {
    label: 'Изменить',
    icon: 'pi pi-fw pi-pencil',
    command: () => beginUpdateRestaurantInteraction(selectedRestaurant.value!)
  },
  {
    label: 'Удалить',
    icon: 'pi pi-fw pi-times',
    command: () => beginDeleteRestaurantInteraction(selectedRestaurant.value!)
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
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Рестораны</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedRestaurant = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateRestaurantInteraction()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" v-model="search" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <Button
              icon="pi pi-pencil"
              :disabled="!selectedRestaurant"
              @click="beginUpdateRestaurantInteraction(selectedRestaurant!)"
            />
            <Button
              :disabled="!selectedRestaurant"
              icon="pi pi-times"
              severity="danger"
              @click="beginDeleteRestaurantInteraction(selectedRestaurant!)"
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
        v-model:selection="selectedRestaurant"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedRestaurant"
        @rowContextmenu="onRowContextMenu"
        :meta-key-selection="false"
        class="border rounded-lg h-full overflow-hidden"
        :value="data?.list"
        lazy
        paginator
        :first="0"
        :rows="rowsPerPage"
        dataKey="id"
        tableStyle="min-width: 50rem"
        @page="onPage($event)"
        :totalRecords="data?.total"
      >
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="id" header="ID" />
        <Column field="name" header="Название" />
        <Column field="adres" header="Адрес" />
        <Column field="active" header="Статус">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.active === true" icon="pi pi-check-circle" value="Активен" severity="success" />
            <Tag v-else-if="slotProps.data.active === false" icon="pi pi-check-circle" value="Не активен" severity="danger" />
          </template>
        </Column>
        <Column field="created_at" header="Создано">
          <template #body="slotProps">
            {{ dateFormat(slotProps.data.created_at) }}
          </template>
        </Column>
        <Column field="updated_at" header="Обновлено">
          <template #body="slotProps">
            {{ dateFormat(slotProps.data.updated_at) }}
          </template>
        </Column>
        <Column field="deleted_at" header="Удалено">
          <template #body="slotProps">
            {{ dateFormat(slotProps.data.deleted_at) }}
          </template>
        </Column>

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
