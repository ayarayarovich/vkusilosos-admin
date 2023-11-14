<template>
  <form @submit="onSubmit">
    <div v-if="fields.length === 0" class="flex flex-col items-center gap-2">
      <p class="text-center">Создайте первый слайд истории</p>
      <i class="pi pi-arrow-down text-base"></i>
    </div>

    <fieldset
      v-for="(field, idx) in fields"
      :key="field.key"
      class="relative border-2 flex items-center gap-4 mb-4 p-2 rounded-lg border-gray-200 border-dashed"
    >
      <div class="flex-1">
        <MyUploadImage
          :name="`slides[${idx}].src`"
          class="rounded-lg"
          filename-prop-in-request="image"
          filename-prop-in-response="fileLink"
          upload-route="admin/upload"
        />
      </div>

      <div class="flex-1">
        <MyInputText :name="`slides[${idx}].text`" label="Текст" />
      </div>
      <button class="absolute top-2 right-2" type="button" @click="remove(idx)">
        <i class="pi pi-times-circle" style="font-size: 1rem"></i>
      </button>
    </fieldset>
    <Button
      class="w-full mt-8 flex justify-center p-4"
      severity="secondary"
      type="button"
      @click="push({})"
    >
      <i class="pi pi-plus" style="font-size: 1rem"></i>
    </Button>

    <Button class="w-full mt-12 flex justify-center p-4" type="submit"> Создать </Button>
  </form>
</template>

<script setup lang="ts">
import MyInputText from '@/components/MyInputText.vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { useForm, useFieldArray } from 'vee-validate'
import * as yup from 'yup'

const toast = useToast()
const queryClient = useQueryClient()

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    slides: yup
      .array()
      .of(
        yup.object({
          text: yup.string().required().label('Текст'),
          src: yup.string().required().label('Изображение')
        })
      )
      .required()
      .min(1, 'Нельзя создать пустую историю. Добавьте слайдов.')
  }),
  initialValues: {
    slides: []
  }
})

const { push, remove, fields } = useFieldArray('slides')

const { mutate } = useMutation({
  mutationFn: (payload: any) => Promise.reject('Stories creation route needs to be fixed'),
  onSuccess() {
    toast.add({
      severity: 'success',
      life: 3000,
      summary: 'Успешно',
      detail: `История создана`
    })
    queryClient.invalidateQueries(['stories'])
  },
  onError(error: any) {
    toast.add({
      severity: 'error',
      life: 3000,
      summary: 'Не удалось создать историю',
      detail: error
    })
  }
})

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
