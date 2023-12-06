<template>
  <form class="mt-8" @submit.prevent="onSubmit">
    <MyInputNumber name="id" label="ID" disabled :initial-value="review.id" />
    <MyInputNumber name="user_id" label="ID пользователя" :initial-value="review.user_id" />

    <div class="flex w-full items-center">
      <span>Не отвечен</span>
      <MyInputSwitch name="status" label="" :initial-value="review.status" />
      <span>Отвечен</span>
    </div>

    <Button
      class="mt-8 flex w-full items-center p-4"
      type="submit"
      label="Сохранить"
      :loading="updateCategoryMutation.isLoading"
      :disabled="updateCategoryMutation.isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Review } from '@/interfaces'

const toast = useToast()
const queryClient = useQueryClient()

const dialogRef = inject('dialogRef') as any
const review = dialogRef.value.data.review as Review

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID отзыва'),
    user_id: yup.string().required().label('ID пользователя'),
    status: yup.boolean().required().label('Статус')
  })
})

const updateCategoryMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosPrivate.put('admin/user/review', payload)
      return response.data
    },
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Изменен статус отзыва ${variables.name} (id: ${variables.id})`
      })
      queryClient.invalidateQueries(['reviews'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить статус отзыва',
        detail: error
      })
    }
  })
)

const onSubmit = handleSubmit((vals) => {
  updateCategoryMutation.mutate(vals)
})
</script>
