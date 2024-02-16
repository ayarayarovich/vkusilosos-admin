<template>
    <form @submit="onSubmit" class="w-full">
        <p class="mb-2 font-medium">Десктопная версия (11:3)</p>
        <MyUploadImage
            name="img"
            class="mb-8 rounded-lg"
            filename-prop-in-request="file"
            filename-prop-in-response="link"
            upload-route="admin/upload"
            :aspect-ratio="11 / 3"
        />

        <p class="mb-2 font-medium">Мобильная версия (12:5)</p>
        <MyUploadImage
            name="phone_img"
            class="mb-8 rounded-lg"
            filename-prop-in-request="file"
            filename-prop-in-response="link"
            upload-route="admin/upload"
            :aspect-ratio="12 / 5"
        />

        <MyInputText name="link" label="Ссылка" />
        <DropdownSelect
            class="mb-6"
            name="active"
            label="Активен"
            placeholder="Выберите"
            :options="[
                {
                    label: 'Не активен',
                    code: false
                },
                {
                    label: 'Активен',
                    code: true
                }
            ]"
        >
            <template #value="slotProps">
                <template v-if="slotProps.value">
                    <Tag
                        v-if="slotProps.value.code === false"
                        icon="pi pi-ban"
                        :value="slotProps.value.label"
                        severity="danger"
                    />
                    <Tag
                        v-else-if="slotProps.value.code === true"
                        icon="pi pi-check-circle"
                        :value="slotProps.value.label"
                        severity="success"
                    />
                </template>
            </template>
            <template #option="slotProps">
                <Tag
                    v-if="slotProps.option.code === false"
                    icon="pi pi-ban"
                    :value="slotProps.option.label"
                    severity="danger"
                />
                <Tag
                    v-else-if="slotProps.option.code === true"
                    icon="pi pi-check-circle"
                    :value="slotProps.option.label"
                    severity="success"
                />
            </template>
        </DropdownSelect>

        <h2 class="mb-6 text-lg font-bold">SEO</h2>
        <div class="grid grid-flow-row grid-cols-2 gap-x-4">
            <MyInputText name="alt" label="Альтернативный текст" />
            <MyInputText name="link" label="Ссылка" />
            <MyInputChips class="col-span-full" name="keywords" label="Ключевые слова" />
        </div>

        <Button class="mt-12 flex w-full justify-center p-4" type="submit">Создать</Button>
    </form>
</template>

<script setup lang="ts">
import MyInputText from '@/components/MyInputText.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import MyInputChips from '@/components/MyInputChips.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUpdateBanner } from './composables'
import type { IBanner } from './interfaces'
import { inject } from 'vue'

const dialogRef = inject('dialogRef') as any
const banner = dialogRef.value.data.banner as IBanner

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        img: yup.string().required().label('Десктопная версия изображения'),
        phone_img: yup.string().required().label('Мобильная версия изображения'),
        link: yup.string().required().label('Ссылка'),
        active: yup.boolean().required().label('Активно')
    }),
    initialValues: banner
})

const { mutate } = useUpdateBanner()

const onSubmit = handleSubmit((vals) => {
    mutate(vals)
})
</script>
