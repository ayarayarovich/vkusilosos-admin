<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { axiosPrivate } from '@/network'

import type { Review } from '@/interfaces'
import { RespondToReview } from '@/features/reviews'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const selected = ref<Review>()
const offset = ref(0)
const limit = rowsPerPage

const query = reactive(
  useQuery<{
    items: Review[]
    total: number
  }>({
    queryKey: ['feedbacks', { offset, limit }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/reviews', {
        params: {
          offset: (queryKey[1] as any).offset as number,
          limit: (queryKey[1] as any).limit as number
        }
      })
      return response.data
    }
  })
)

const onPage = (e: DataTablePageEvent) => {
  offset.value = e.first
  limit.value = e.rows
}

const refresh = () => {
  query.refetch()
}

const dialog = useDialog()

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
    label: 'Ответить',
    icon: 'pi pi-fw pi-pencil',
    command: () => beginRespondToReviewInteraction(selected.value!)
  }
])

const beginRespondToReviewInteraction = (review: Review) => {
  dialog.open(RespondToReview, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Ответить на отзыв'
    } as any,
    data: {
      review
    }
  })
}

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
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Отзывы</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="query.isFetching" @click="refresh()" />
            <Button icon="pi pi-pencil" :disabled="!selected" @click="beginRespondToReviewInteraction(selected!)" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2"></div>
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
        v-model:selection="selected"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selected"
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
        :totalRecords="query.data?.total"
      >
        <Column expander class="w-12"></Column>
        <Column field="id" header="ID"></Column>
        <Column field="text" header="Текст"> </Column>
        <Column field="status" header="Статус"> </Column>

        <template #expansion="slotProps">
          <div class="p-3">
            <h5>Пользователь {{ slotProps.data.user.name }}</h5>
            <DataTable :value="[slotProps.data.user]">
              <Column field="id" header="ID"></Column>
              <Column field="name" header="Имя"></Column>
            </DataTable>
          </div>
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
