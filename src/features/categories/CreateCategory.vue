<template>
  <form class="mt-8 w-full" @submit.prevent="onSubmit">
    <div>
      <MyInputText name="name" label="Название" />
    </div>
    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Создать"
      :loading="createCategoryMutation.isLoading"
      :disabled="createCategoryMutation.isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import MyInputText from '@/components/MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const toast = useToast()
const queryCLient = useQueryClient()

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required().label('Название')
  })
})

const createCategoryMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => axiosPrivate.post('admin/category', payload),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Добавлена категория ${variables.name}`
      })
      queryCLient.invalidateQueries(['categories'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось создать категорию',
        detail: error
      })
    }
  })
)

const onSubmit = handleSubmit((vals) => {
  createCategoryMutation.mutate(vals)
})
</script>
