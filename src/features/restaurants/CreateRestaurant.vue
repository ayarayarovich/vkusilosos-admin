<template>
  <form class="p-2" @submit.prevent="onSubmit">
    <h2 class="text-lg font-bold mb-4">Общая информация</h2>
    <div class="flex gap-4 mb-8">
      <MyInputText name="name" label="Название" />
    </div>

    <h2 class="text-lg font-bold mb-4">Локация</h2>
    <div class="flex gap-4 mb-2">
      <MyInputText name="address" label="Адрес" />
    </div>
    <div class="flex gap-4 mb-8">
      <MyInputNumber name="lat" label="Широта" />
      <MyInputNumber name="lon" label="Долгота" />
    </div>

    <h2 class="text-lg font-bold mb-4">GeoJson</h2>
    <MyUploadFile
      name="geojson"
      uploadRoute="admin/geojson"
      filenamePropInRequest="geojson"
      filenamePropInResponse="geoJsonName"
    />

    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Создать"
      :loading="createRestaurantMutation.isLoading"
      :disabled="createRestaurantMutation.isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyUploadFile from '@/components/MyUploadFile.vue'

const toast = useToast()
const queryClient = useQueryClient()

const schema = yup.object({
  name: yup.string().required().label('Название ресторана'),
  address: yup.string().required().label('Адрес ресторана'),
  lat: yup.number().required().label('Широта'),
  lon: yup.number().required().label('Долгота'),
  geojson: yup.string().required().label('GeoJson')
})

const { handleSubmit } = useForm({
  validationSchema: schema
})

const createRestaurantMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => axiosPrivate.post('admin/rest', payload),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Создан ресторан ${variables.name}`
      })
      queryClient.invalidateQueries(['rests'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось создать ресторан',
        detail: error
      })
    }
  })
)

const onSubmit = handleSubmit((v) => {
  createRestaurantMutation.mutate(v)
})

</script>
