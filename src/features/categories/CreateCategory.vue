<template>
  <form class="mt-8 w-full" @submit.prevent="onSubmit">
    <div>
      <MyInputText name="name" label="Название" />
    </div>
    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Создать"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import MyInputText from '@/components/MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useCreateCategory } from './composables'

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required().label('Название')
  })
})

const { mutate, isLoading } = useCreateCategory()

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
