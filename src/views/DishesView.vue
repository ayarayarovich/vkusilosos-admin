<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'

import dateFormat from 'dateformat'
import { useDebounce } from '@vueuse/core'

import { CreateDish, DeleteDish, UpdateDish, useDishes, type IDish } from '@/features/dishes'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const searchTerm = ref('')
const selected = ref<IDish>()
const debouncedSearchTerm = useDebounce(searchTerm, 500)

const { data, refetch, isFetching, isError } = useDishes(
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
const beginCreateDishInteraction = () => {
    dialog.open(CreateDish, {
        props: {
            class: 'w-full max-w-4xl',
            modal: true,
            header: 'Новое блюдо'
        } as any
    })
}
const beginUpdateDishInteraction = (dish: IDish) => {
    dialog.open(UpdateDish, {
        props: {
            class: 'w-full max-w-4xl',
            modal: true,
            header: 'Изменить блюдо'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            dish
        }
    })
}

const beginDeleteDishInteraction = (dish: IDish) => {
    dialog.open(DeleteDish, {
        props: {
            class: 'w-full max-w-xl',
            modal: true,
            header: 'Изменить блюдо'
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            dish
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
        command: () => beginCreateDishInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginUpdateDishInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteDishInteraction(selected.value!)
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
    <main class="flex h-screen flex-col items-stretch px-4" ref="root">
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Блюда</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar>
            <template #center>
                <div class="flex w-full">
                    <div class="flex flex-1 justify-start gap-2">
                        <Button icon="pi pi-refresh" :disabled="isFetching" @click="refresh()" />
                        <Button icon="pi pi-plus" @click="beginCreateDishInteraction()" />
                    </div>

                    <div class="flex flex-1 justify-center">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText placeholder="Поиск" v-model="searchTerm" />
                        </span>
                    </div>

                    <div class="flex flex-1 justify-end gap-2">
                        <Button
                            icon="pi pi-pencil"
                            :disabled="!selected"
                            @click="beginUpdateDishInteraction(selected!)"
                        />
                        <Button
                            :disabled="!selected"
                            icon="pi pi-times"
                            severity="danger"
                            @click="beginDeleteDishInteraction(selected!)"
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
                <Column field="name" header="Название" />
                <Column field="img" header="Картинка">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.img"
                            :alt="slotProps.data.img"
                            class="aspect-[4/3] w-[6rem] min-w-[6rem] rounded-lg object-cover drop-shadow-md"
                        />
                    </template>
                </Column>
                <Column field="price" header="Цена">
                    <template #body="slotProps">{{ slotProps.data.price }} ₽</template>
                </Column>
                <Column field="active" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            :value="slotProps.data.active ? 'Активно' : 'Заблокировано'"
                            :severity="slotProps.data.active ? 'success' : 'danger'"
                        />
                    </template>
                </Column>
                <Column field="active" header="Наличие">
                    <template #body="slotProps">
                        <Tag
                            :value="slotProps.data.have ? 'Есть' : 'Нету'"
                            :severity="slotProps.data.have ? 'success' : 'danger'"
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
