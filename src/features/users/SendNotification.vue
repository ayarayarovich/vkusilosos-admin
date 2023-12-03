<template>
  <form @submit="onSubmit">
    <MyInputNumber name="user_id" label="ID пользователя" disabled />
    <MyInputText name="title" label="Заголовок" class="mb-4" />
    <MyInputText name="text" label="Тело" class="mb-4" />

    <h2 class="text-lg font-medium mb-1">Куда отправить?</h2>
    <small class="block p-error mb-3">{{ errors[''] || '&nbsp;' }}</small>
    <MyInputSwitch name="push" label="Пуш" :initial-value="true" />
    <MyInputSwitch name="email" label="Электронная почта" />
    <MyInputSwitch name="phone" label="SMS" />

    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Отправить"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import type { User } from '@/interfaces'
import MyInputNumber from '@/components/MyInputNumber.vue'
import { useForm } from 'vee-validate'
import yup from '@/yup'
import MyEditor from '@/components/MyEditor.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'
import { useSendNotificationToUser } from '.'
import { inject } from 'vue'
import MyInputText from '@/components/MyInputText.vue'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as User

const { handleSubmit, errors } = useForm({
  validationSchema: (
    yup.object({
      user_id: yup.number().required().label('ID пользователя'),
      title: yup.string().required().label('Заголовок'),
      text: yup.string().required().label('Тело'),
      push: yup.boolean().label('Пуш-уведомление'),
      email: yup.boolean().label('Электронная почта'),
      phone: yup.boolean().label('SMS')
    }) as any
  ).atLeastOneIsTrueOf(['push', 'email', 'phone']),
  initialValues: {
    user_id: user.id
  }
})

const { mutateAsync, isLoading } = useSendNotificationToUser()

const onSubmit = handleSubmit((vals) => {
  mutateAsync(vals).then(dialogRef.value.close)
})
</script>
