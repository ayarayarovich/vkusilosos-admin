<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useDebounce } from '@vueuse/core'

import dateFormat from 'dateformat'
import { ChangeStatus, GiftBonusesToUser, SendNotification, useUsers, type IUser } from '@/features/users'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const search = ref('')
const debouncedSearch = useDebounce(search, 500)

const selectedUser = ref()

const { data, isFetching, isError, refetch } = useUsers(
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
const beginBlockUnblockUserInteraction = (user: IUser) => {
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

const beginGiftBonusesToUserInteraction = (user: IUser) => {
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

const beginSendNotificationInteraction = (user: IUser) => {
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
    label: 'Изменить статус',
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
            <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
          </div>

          <div class="flex-1 flex justify-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Поиск" v-model="search" />
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
      <Message v-if="isError" severity="error" :closable="false"
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
        :value="data?.users"
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
        <Column field="name" header="Имя" />
        <Column field="surname" header="Фамилия" />
        <Column field="phone" header="Телефон" />
        <Column field="role" header="Роль">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.role === 'user'" icon="pi pi-user" value="Обычный" severity="info"></Tag>
            <Tag v-else-if="slotProps.data.role === 'admin'" icon="pi pi-bolt" value="Админ" severity="warning"></Tag>
            <Tag v-else :value="slotProps.data.role" severity="info" />
          </template>
          </Column>
        <Column field="status" header="Статус">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.status === 0" icon="pi pi-lock" value="Заблокирован" severity="danger"/>
            <Tag v-else-if="slotProps.data.status === 1" icon="pi pi-check-circle" value="Активен" severity="success"/>
            <Tag v-else-if="slotProps.data.status === 2" icon="pi pi-clock" value="На модерации" severity="warning"/>
            <Tag v-else :value="slotProps.data.status" severity="info" />
          </template>
        </Column>
        <Column field="summ" header="Сумма чеков">
          <template #body="slotProps">
            {{ slotProps.data.summ }} ₽
          </template>
        </Column>
        <Column field="email" header="Email" />
        <Column field="bonuses" header="Бонусы" />
        <Column field="birthday" header="День рождения">
          <template #body="slotProps">
            {{ dateFormat(slotProps.data.birthday, 'dd.mm.yyyy') }}
          </template>
        </Column>
        <Column field="choosed_adres" header="Адрес доставки" />
        <Column field="choosed_rest" header="Ресторан" />
        <Column field="get_pushes" header="Уведомления">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.get_pushes === false" icon="pi pi-ban" value="Отключены" severity="danger"/>
            <Tag v-else-if="slotProps.data.get_pushes === true" icon="pi pi-bell" value="Включены" severity="success"/>
          </template>
        </Column>
        <Column field="last_point" header="Сумма последнего заказа">
          <template #body="slotProps">
            {{ slotProps.data.last_point }} ₽
          </template>
        </Column>
        <Column field="point" header="point" />
        <Column field="referal" header="Реферал" />
        <Column field="share_id" header="Реферальный код" />
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
