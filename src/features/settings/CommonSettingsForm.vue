<template>
    <form @submit="onSubmitCommonSettings">
        <h1 class="mb-6 text-xl font-bold">Общие настройки</h1>
        <div class="flex gap-8">
            <div class="flex-1">
                <MyInputNumber
                    name="from_delivery"
                    label="Бесплатная доставки при заказе от..."
                    mode="currency"
                    currency="RUB"
                />
                <MyInputNumber name="bonus_percent" label="Процент бонусов" />
                <MyInputText name="instagram" label="Instagram" />
                <MyInputText name="vk" label="VK" />
            </div>

            <div class="flex-1">
                <MyInputText name="whatsapp" label="WhatsApp" />
                <MyInputText name="viber" label="Viber" />
                <MyInputText name="phone" label="Телефон" />
                <MyInputText name="email" label="Email" />
            </div>
        </div>
        <MyMultiSelect
            label="Блюда"
            name="dishes"
            :options="dishesOptions || []"
            :max-selected-labels="3"
        />

        <Button label="Обновить настройки" class="mt-4 w-full" type="submit" />
    </form>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { axiosPrivate } from '@/network'
import { useForm } from 'vee-validate'

import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyMultiSelect from '@/components/MyMultiSelect.vue'

const toast = useToast()
const queryClient = useQueryClient()

const { data: dishesOptions } = useQuery({
    queryKey: ['short-dishes'],
    queryFn: async () => {
        const response = await axiosPrivate.get('admin/dishes/rec')
        return response.data
    },
    select: (v) => v.map((d) => ({ code: d.id, label: `[id: ${d.id}]: ${d.name}` }))
})

const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
        const response = await axiosPrivate.get('admin/settings')
        return response.data
    }
})

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        from_delivery: yup
            .number()
            .required()
            .label('Сумма, начиная с которой доставка бесплатная'),
        bonus_percent: yup.number().required().label('Процент бонусов от суммы заказа'),
        instagram: yup.string().required().label('Ссылка на Instagram'),
        vk: yup.string().required().label('Ссылка на ВК'),
        whatsapp: yup.string().required().label('Номер WhatsApp'),
        viber: yup.string().required().label('Номер Viber'),
        phone: yup.string().required().label('Номер телефона'),
        email: yup.string().required().label('Электронная почта'),
        dishes: yup.array().of(yup.number()).required().label('Блюда рекомендаций')
    }),
    initialValues: data
})

const { mutate: mutate } = useMutation({
    mutationFn: (vars: any) => axiosPrivate.put('admin/settings', vars),
    onSuccess: () => {
        toast.add({
            summary: 'Настройки обновлены',
            severity: 'success',
            life: 3000
        })
        queryClient.invalidateQueries(['settings'])
    },
    onError: (error) => {
        toast.add({
            summary: 'Ошибка',
            detail: error,
            life: 3000
        })
    }
})

const onSubmitCommonSettings = handleSubmit((vals) => {
    mutate(vals)
})
</script>
