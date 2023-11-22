<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'
import { useDebounce } from '@vueuse/core'
import { axiosPrivate } from '@/network'

import type { User } from '@/interfaces'
import { ChangeStatus, GiftBonusesToUser, SendNotification } from '@/features/users'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const searchTerm = ref('')
const debouncedSearchTerm = useDebounce(searchTerm, 500)

const selectedUser = ref()

const query = reactive(
  useQuery<{
    items: User[]
    total: number
  }>({
    queryKey: ['users', { offset, limit, searchTerm: debouncedSearchTerm }],
    queryFn: async ({ queryKey }) => {
      const response = await axiosPrivate.get('admin/users', {
        params: {
          offset: (queryKey[1] as any).offset as number,
          limit: (queryKey[1] as any).limit as number,
          search: (queryKey[1] as any).searchTerm as string
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

const dialog = useDialog()
const beginBlockUnblockUserInteraction = (user: User) => {
  dialog.open(ChangeStatus, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Изменить статус пользователя'
    } as any,
    data: {
      user
    }
  })
}

const beginGiftBonusesToUserInteraction = (user: User) => {
  dialog.open(GiftBonusesToUser, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Подарить бонусы пользователю'
    } as any,
    data: {
      user
    }
  })
}

const beginSendNotificationInteraction = (user: User) => {
  dialog.open(SendNotification, {
    props: {
      class: 'w-full max-w-xl',
      modal: true,
      header: 'Отправить уведомление'
    } as any,
    data: {
      user
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
    label: 'Заблокировать/Разблокировать',
    icon: 'pi pi-fw pi-user-edit',
    command: () => beginBlockUnblockUserInteraction(selectedUser.value!)
  },
  {
    label: 'Подарить бонусы',
    icon: 'pi pi-fw pi-gift',
    command: () => beginGiftBonusesToUserInteraction(selectedUser.value!)
  },
  {
    label: 'Отправить уведомление',
    icon: 'pi pi-fw pi-bell',
    command: () => beginSendNotificationInteraction(selectedUser.value!)
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
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Пользователи</h1>

    <ContextMenu ref="cm" :model="menuModel" @hide="selectedUser = undefined" />

    <Toolbar>
      <template #center>
        <div class="w-full flex">
          <div class="flex-1 flex justify-start gap-2">
            <Button icon="pi pi-refresh" :disabled="query.isFetching" @click="refresh()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" v-model="searchTerm" />
            </span>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <Button
              icon="pi pi-user-edit"
              :disabled="!selectedUser"
              @click="beginBlockUnblockUserInteraction(selectedUser!)"
            />
            <Button
              :disabled="!selectedUser"
              icon="pi pi-gift"
              severity="primary"
              @click="beginGiftBonusesToUserInteraction(selectedUser!)"
            />
            <Button
              :disabled="!selectedUser"
              icon="pi pi-bell"
              severity="primary"
              @click="beginSendNotificationInteraction(selectedUser!)"
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
        class="border rounded-lg h-full overflow-hidden"
        scrollable
        :scroll-height="scrollHeight"
        v-model:selection="selectedUser"
        selection-mode="single"
        contextMenu
        v-model:contextMenuSelection="selectedUser"
        @rowContextmenu="onRowContextMenu"
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
      >
        <Column selectionMode="single" headerStyle="width: 3rem" />
        <Column field="id" header="ID" />
        <Column field="name" header="Имя" />
        <Column field="surname" header="Фамилия" />
        <Column field="phone" header="Телефон" />
        <Column field="role" header="Роль" />
        <Column field="status" header="Статус">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="slotProps.data.status === 'blocked' ? 'danger' : 'success'"
            />
          </template>
        </Column>
        <Column field="tolal_order" header="Сумма чеков" />
        <Column field="bonuses" header="Бонусы" />

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
