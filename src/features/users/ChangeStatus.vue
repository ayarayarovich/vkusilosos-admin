<template>
    <form @submit="onSubmit">
        <MyInputNumber name="user_id" label="ID пользователя" disabled />
        <DropdownSelect
            name="status"
            label="Статус"
            placeholder="Выберите"
            :options="possibleStatuses"
        >
            <template #value="slotProps">
                <template v-if="slotProps.value">
                    <Tag
                        v-if="slotProps.value.code === 0"
                        icon="pi pi-lock"
                        value="Заблокирован"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 1"
                        icon="pi pi-check-circle"
                        value="Активен"
                        severity="success"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === 2"
                        icon="pi pi-clock"
                        value="На модерации"
                        severity="warning"
                    />
                </template>
            </template>
            <template #option="slotProps">
                <template v-if="slotProps.option">
                    <Tag
                        v-if="slotProps.option.code === 0"
                        icon="pi pi-lock"
                        value="Заблокирован"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.option.code === 1"
                        icon="pi pi-check-circle"
                        value="Активен"
                        severity="success"
                    />
                    <Tag
                        v-else-if="slotProps.option.code === 2"
                        icon="pi pi-clock"
                        value="На модерации"
                        severity="warning"
                    />
                </template>
            </template>
        </DropdownSelect>

        <Button
            class="mt-8 flex w-full items-center p-4"
            type="submit"
            label="Сохранить"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </form>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { IUser } from './interfaces'
import { useChangeUserStatus } from './composables'
import { useForm } from 'vee-validate'
import yup from '@/yup'

import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as IUser

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        user_id: yup.number().required().label('ID пользователя'),
        status: yup.number().required().label('Статус')
    }),
    initialValues: {
        user_id: user.id,
        status: user.status
    }
})

const possibleStatuses = ref([
    { label: 'Заблокирован', code: 0 },
    { label: 'Активен', code: 1 },
    { label: 'На модерации', code: 2 }
])

const { mutateAsync, isLoading } = useChangeUserStatus()

const onSubmit = handleSubmit((vals) => {
    mutateAsync(vals).then(dialogRef.value.close)
})
</script>
