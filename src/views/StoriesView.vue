<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import dateFormat from '@/dateformat'

import {
    CreateStory,
    useStories,
    type IStoryImage,
    type IStoryVideo,
    DeleteStory,
    EditStory
} from '@/features/stories'
import { useDialog } from 'primevue/usedialog'

const rowsPerPage = ref(20)

const offset = ref(0)
const limit = rowsPerPage
const selected = ref<IStoryImage | IStoryVideo>()

const { data, isFetching, isError, refetch } = useStories(
    {
        limit,
        offset,
        search: ''
    },
    (v) => {
        console.log(v)
        return v
    }
)

const onPage = (e: DataTablePageEvent) => {
    offset.value = e.first
    limit.value = e.rows
}

const dialog = useDialog()

const beginCreateStoryInteraction = () => {
    dialog.open(CreateStory, {
        props: {
            class: 'max-w-4xl w-full mx-4',
            modal: true,
            header: 'Новая история',
            dismissableMask: true
        } as any
    })
}

const beginDeleteStoryInteraction = (story: IStoryImage | IStoryVideo) => {
    dialog.open(DeleteStory, {
        props: {
            class: 'max-w-xl w-full mx-4',
            modal: true,
            header: 'Удалить историю',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            story
        }
    })
}

const beginEditStoryInteraction = (story: IStoryImage | IStoryVideo) => {
    dialog.open(EditStory, {
        props: {
            class: 'max-w-4xl w-full mx-4',
            modal: true,
            header: 'Изменить историю',
            dismissableMask: true
        } as any,
        onClose: () => {
            selected.value = undefined
        },
        data: {
            story
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
        command: () => beginCreateStoryInteraction()
    },
    {
        label: 'Изменить',
        icon: 'pi pi-fw pi-pencil',
        command: () => beginEditStoryInteraction(selected.value!)
    },
    {
        label: 'Удалить',
        icon: 'pi pi-fw pi-times',
        command: () => beginDeleteStoryInteraction(selected.value!)
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
        <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Истории</h1>

        <ContextMenu ref="cm" :model="menuModel" @hide="selected = undefined" />

        <Toolbar>
            <template #center>
                <div class="flex w-full flex-wrap gap-2">
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-refresh"
                        :disabled="isFetching"
                        @click="refresh()"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-plus"
                        @click="beginCreateStoryInteraction()"
                    />
                    <div class="p-input-icon-left grow max-md:order-1 max-md:w-full">
                        <i class="pi pi-search" />
                        <InputText placeholder="Поиск" disabled class="w-full" />
                    </div>
                    <Button
                        class="shrink-0 max-md:grow"
                        icon="pi pi-pencil"
                        :disabled="!selected"
                        @click="beginEditStoryInteraction(selected!)"
                    />
                    <Button
                        class="shrink-0 max-md:grow"
                        :disabled="!selected"
                        icon="pi pi-times"
                        severity="danger"
                        @click="beginDeleteStoryInteraction(selected!)"
                    />
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
                :page-link-size="5"
                :paginator-template="{
                    '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                    '960px':
                        'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
                    '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
                }"
                current-page-report-template="{currentPage} из {totalPages}"
            >
                <Column selectionMode="single" headerStyle="width: 3rem" />
                <Column field="id" header="ID" />
                <Column field="preview" header="Превью">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.preview"
                            oner
                            alt=""
                            class="aspect-[9/16] w-[5rem] min-w-[5rem] rounded-md object-cover drop-shadow-md"
                        />
                    </template>
                </Column>
                <Column field="active" header="Статус">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.active === false"
                            icon="pi pi-lock"
                            value="Не активна"
                            severity="danger"
                        />
                        <Tag
                            v-else-if="slotProps.data.active === true"
                            icon="pi pi-check-circle"
                            value="Активна"
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
                <Column field="deleted_at" header="Удалено">
                    <template #body="slotProps">
                        {{ dateFormat(slotProps.data.deleted_at) }}
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
