<template>
  <form class="mt-8" @submit.prevent="onSubmit">
    <MyInputNumber name="id" label="ID" disabled :initial-value="category.id" />
    <MyInputText name="name" label="Название" :initial-value="category.name" />

    <Button
      class="w-full flex items-center p-4 mt-8"
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
import MyInputText from '@/components/MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Category } from '@/interfaces'

const toast = useToast()
const queryClient = useQueryClient()

const dialogRef = inject('dialogRef') as any
const category = dialogRef.value.data.category as Category

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID категории'),
    name: yup.string().required().label('Название категории')
  })
})

const updateCategoryMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosPrivate.put('admin/category', payload)
      return response.data
    },
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Изменена категория ${variables.name} (id: ${variables.id})`
      })
      queryClient.invalidateQueries(['categories'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить категорию',
        detail: error
      })
    }
  })
)

const onSubmit = handleSubmit((vals) => {
  updateCategoryMutation.mutate(vals)
})
</script>
