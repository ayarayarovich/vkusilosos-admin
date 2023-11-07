<template>
  <div>
    <Button
      label="Изменить"
      icon="pi pi-external-link"
      :disabled="disabled"
      @click="visible = true"
    />
    <Dialog
      v-model:visible="visible"
      modal
      :header="`Изменить категорию ${props.category?.name} (id: ${props.category?.id})`"
      class="max-w-xl w-full m-4"
    >
      <form class="p-2" @submit.prevent="onSubmit">
        <MyInputNumber name="id" label="ID" disabled :initial-value="props.category?.id" />
        <MyInputText name="name" label="Название" />

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Сохранить"
          :loading="updateCategoryMutation.isLoading"
          :disabled="updateCategoryMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import MyInputNumber from './MyInputNumber.vue'
import MyInputText from './MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Category } from '@/interfaces'

const props = defineProps<{
  disabled?: boolean
  category?: Category
}>()

const toast = useToast()
const queryClient = useQueryClient()
const visible = ref(false)

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
