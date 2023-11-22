<template>
  <form @submit="onSubmit" class="w-full">
    <MyUploadImage
      name="img"
      class="rounded-lg mb-8"
      filename-prop-in-request="image"
      filename-prop-in-response="fileLink"
      upload-route="admin/upload"
      :aspect-ratio="30 / 9"
    />

    <MyInputNumber name="acc_id" label="ID акции" />

    <Button class="w-full mt-12 flex justify-center p-4" type="submit"> Создать </Button>
  </form>
</template>

<script setup lang="ts">
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const toast = useToast()
const queryClient = useQueryClient()

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    img: yup.string().required().label('Изображение'),
    acc_id: yup.number().required().label('ID акции')
  })
})

const { mutate } = useMutation({
  mutationFn: (payload: any) => Promise.reject('Banner creation route not linked yet'),
  onSuccess() {
    toast.add({
      severity: 'success',
      life: 3000,
      summary: 'Успешно',
      detail: `Баннер создан`
    })
    queryClient.invalidateQueries(['banners'])
  },
  onError(error: any) {
    toast.add({
      severity: 'error',
      life: 3000,
      summary: 'Не удалось создать баннер',
      detail: error
    })
  }
})

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
