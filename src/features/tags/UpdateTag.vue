<template>
  <form class="p-2" @submit="onSubmit">
    <div class="flex items-center gap-4">
      <div class="h-64 aspect-square">
        <MyUploadImage
          name="img"
          class="rounded-lg"
          :aspectRatio="1 / 1"
          uploadRoute="admin/upload"
          filenamePropInRequest="file"
          filenamePropInResponse="link"
        />
      </div>
      <div>
        <MyInputNumber name="id" label="id" disabled />
        <MyInputText name="name" label="Название" />
      </div>
    </div>
    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Сохранить"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useUpdateTag } from './composables'
import { inject } from 'vue'
import type { ITag } from './interfaces'
import MyInputNumber from '@/components/MyInputNumber.vue'

const dialogRef = inject('dialogRef') as any
const tag = dialogRef.value.data.tag as ITag

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('id тэга'),
    name: yup.string().required().label('Название тега'),
    img: yup.string().required().label('Изображение')
  }),
  initialValues: {
    id: tag.id,
    name: tag.name,
    img: tag.img
  }
})

const { mutate, isLoading } = useUpdateTag()

const onSubmit = handleSubmit((v) => {
  mutate(v)
})
</script>
