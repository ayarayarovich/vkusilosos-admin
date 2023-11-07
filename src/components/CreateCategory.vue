<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Создать категорию" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Создать категорию" class="max-w-xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
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
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import MyInputText from './MyInputText.vue'
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

const visible = ref(false)
</script>
