<template>
  <form @submit="onSubmit">
    <MyInputNumber name="user_id" label="ID" disabled />
    <MyInputNumber name="bonuses" label="Количество бонусов" />

    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Подарить"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import type { User } from '@/interfaces'
import MyInputNumber from '@/components/MyInputNumber.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import { useGiftBonusesToUser } from './composables'
import { inject } from 'vue'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as User

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    user_id: yup.number().required().label('ID пользователя'),
    bonuses: yup.number().required().label('Количество бонусов')
  }),
  initialValues: {
    user_id: user.id
  }
})

const { mutateAsync, isLoading } = useGiftBonusesToUser()

const onSubmit = handleSubmit((vals) => {
  mutateAsync(vals).then(dialogRef.value.close)
})
</script>
