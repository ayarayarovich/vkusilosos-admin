<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import { CreateBanner, useBanners, DeleteBanner, type IBanner } from '@/features/banners'
import { useDialog } from 'primevue/usedialog'
import { useDebounce } from '@vueuse/core'
import dateFormat from 'dateformat'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const debouncedSearch = useDebounce(search, 500)
const selectedBanner = ref<any>()

const { data, isFetching, isError, refetch } = useBanners(
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

const beginCreateBannerInteraction = () => {
  dialog.open(CreateBanner, {
    props: {
      class: 'max-w-4xl w-full',
      modal: true,
      header: 'Новый баннер'
    } as any,
  })
}

const beginDeleteBannerInteraction = (banner: IBanner) => {
  dialog.open(DeleteBanner, {
    props: {
      class: 'max-w-xl w-full',
      modal: true,
      header: 'Удалить баннер'
    } as any,
    data: {
      banner
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
    command: () => beginCreateBannerInteraction()
  },
  {
    label: 'Удалить',
    icon: 'pi pi-fw pi-times',
    command: () => beginDeleteBannerInteraction(selectedBanner.value!)
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
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Баннеры</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedBanner = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
            <Button icon="pi pi-plus" @click="beginCreateBannerInteraction()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <Button
              :disabled="!selectedBanner"
              icon="pi pi-times"
              severity="danger"
              @click="beginDeleteBannerInteraction(selectedBanner!)"
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
        v-model:selection="selectedBanner"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedBanner"
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
        <Column field="img" header="Картинка">
          <template #body="slotProps">
            <img
              :src="slotProps.data.img"
              oner
              alt=""
              class="h-24 aspect-[30/9] object-cover drop-shadow-md rounded-md"
            />
          </template>
        </Column>
        <Column field="link" header="Ссылка">
          <template #body="slotProps">
            <a :href="slotProps.data.link" class="underline">{{ slotProps.data.link }}</a>
          </template>
        </Column>
        <Column field="active" header="Статус">
          <template #body="slotProps">
            <Tag
              v-if="slotProps.data.active === false"
              icon="pi pi-lock"
              value="Не активен"
              severity="danger"
            />
            <Tag
              v-else-if="slotProps.data.active === true"
              icon="pi pi-check-circle"
              value="Активен"
              severity="success"
            />
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
