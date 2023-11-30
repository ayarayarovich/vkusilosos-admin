<template>
  <form @submit.prevent="onSubmit">
    <div class="py-4 border-t">
      <MyInputNumber name="id" label="ID" disabled :initial-value="category.ID" />
      <MyInputText name="name" label="Название" :initial-value="category.name" />
    </div>

    <Button
      class="w-full flex items-center"
      type="submit"
      label="Сохранить"
      size="small"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputText from '@/components/MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUpdateCategory } from './composables'
import type { ICategory } from './interfaces'

const dialogRef = inject('dialogRef') as any
const category = dialogRef.value.data.category as ICategory

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID категории'),
    name: yup.string().required().label('Название категории')
  })
})

const { mutate, isLoading } = useUpdateCategory()

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
