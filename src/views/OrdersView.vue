<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import { useOrders, type IOrder } from '@/features/orders'
import UpdateOrderStatus from '@/features/orders/UpdateOrderStatus.vue'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selected = ref<IOrder>()

const { data, isFetching, isError, refetch } = useOrders(
    {
        offset,
        limit,
        search: ''
    },
    (v) => v
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const refresh = () => {
    refetch()
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
    }
])

const beginUpdateOrderStatusInteraction = (order: IOrder) => {
    dialog.open(UpdateOrderStatus, {
        props: {
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Обновить статус'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            order
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
    <main class="flex h-screen flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Заказы</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar>
            <template #center>
                <div class="flex w-full">
                    <div class="flex flex-1 justify-start gap-2">
                        <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
                    </div>

                    <div class="flex flex-1 justify-center">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText disabled placeholder="Поиск" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            class="hidden"
                            icon="pi pi-pencil"
                            :disabled="!selected"
                            @click="beginUpdateOrderStatusInteraction(selected!)"
                        />
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="min-h-0 flex-1 py-6">
            <Message v-if="isError" severity="error" :closable="false">
                Не удалось загрузить таблицу
            </Message>
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
                class="h-full overflow-hidden rounded-lg border"
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
                <Column field="user_id" header="ID пользователя" />
                <Column field="promo" header="Промокод" />
                <Column field="status" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.status === 'accepted'"
                            icon="pi pi-fw pi-check-circle"
                            value="Выполнен"
                            severity="success"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'delivered'"
                            icon="pi pi-fw pi-check-circle"
                            value="Доставлен"
                            severity="success"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'waitAdmin'"
                            icon="pi pi-fw pi-exclamation-circle"
                            value="Ожидает подтверждения админа"
                            severity="warning"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'rejectedByUser'"
                            icon="pi pi-fw pi-ban"
                            value="Отменён клиентом"
                            severity="danger"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'rejectedByAdmin'"
                            icon="pi pi-fw pi-ban"
                            value="Отменён админом"
                            severity="danger"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'rejected'"
                            icon="pi pi-fw pi-ban"
                            value="Отменён"
                            severity="danger"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'wait pay'"
                            icon="pi pi-fw pi-clock"
                            value="Ожидает оплаты"
                            severity="warning"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'cooking'"
                            icon="pi pi-fw pi-heart-fill"
                            value="Готовится"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'process'"
                            icon="pi pi-fw pi-clock"
                            value="В процессе"
                        />
                        <Tag
                            v-else-if="slotProps.data.status === 'deliver'"
                            icon="pi pi-fw pi-truck"
                            value="В пути"
                            severity="info"
                        />
                        <Tag v-else :value="slotProps.data.status" severity="danger" />
                    </template>
                </Column>
                <Column field="price" header="Сумма">
                    <template #body="slotProps">{{ slotProps.data.price }} ₽</template>
                </Column>
                <Column field="count_items" header="Кол-во позиций" />
                <Column field="pay_type" header="Способ оплаты">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.pay_type === 0"
                            icon="pi pi-fw pi-credit-card"
                            value="Карта"
                        />
                        <Tag
                            v-else-if="slotProps.data.pay_type === 1"
                            icon="pi pi-fw pi-money-bill"
                            value="Наличные"
                        />
                        <Tag v-else-if="slotProps.data.pay_type === 2" class="bg-gray-200">
                            <img class="h-4" src="/tinkoff.svg" alt="" />
                        </Tag>
                        <Tag v-else :value="slotProps.data.pay_type" severity="info" />
                    </template>
                </Column>
                <Column field="iiko_id" header="IIKO ID" />

                <template #loading>
                    <ProgressSpinner class="h-8" />
                </template>
                <template #empty>
                    <div class="flex flex-col items-center gap-4 py-12">
                        <img class="h-36" src="/empty.svg" alt="" />
                        <span>Нет данных</span>
                    </div>
                </template>
            </DataTable>
        </div>
    </main>
</template>
