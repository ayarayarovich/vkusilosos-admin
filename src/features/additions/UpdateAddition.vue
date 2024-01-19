<template>
    <form class="mt-8" @submit="onSubmit">
        <div class="mb-8 grid grid-cols-3 items-center justify-items-center gap-4">
            <MyInputNumber name="id" label="ID" disabled />
            <MyInputText label="Название" name="name" />
            <MyInputNumber label="Вес" name="weight" />
            <MyInputNumber label="Цена" name="price" />
            <MyInputNumber label="Количество" name="count" />

            <div class="col-span-1 col-start-1 row-span-2 row-start-1 w-full">
                <MyUploadImage
                    class="rounded-lg"
                    name="img"
                    :aspect-ratio="4 / 3"
                    filename-prop-in-request="file"
                    filename-prop-in-response="link"
                    upload-route="admin/upload"
                />
            </div>
        </div>

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
import { inject } from 'vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'

import { useUpdateAddition, useAddition } from './composables'
import type { IAddition } from './interfaces'

const dialogRef = inject('dialogRef') as any
const addition = dialogRef.value.data.addition as IAddition

const { handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        name: yup.string().required().label('Название'),
        img: yup.string().required().label('Изображение'),
        price: yup.number().required().label('Цена'),
        weight: yup.number().required().label('Вес'),
        count: yup.number().required().label('Количество кусочков')
    })
})

const { data: additionData } = useAddition(addition.id, (v) => {
    resetForm({
        values: v
    })
    return v
})

const { mutate, isLoading } = useUpdateAddition()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
