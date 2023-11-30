<template>
  <form class="p-2" @submit.prevent="onSubmit">
    <h2 class="text-lg font-bold mb-4">Общая информация</h2>
    <div class="flex gap-4 mb-8">
      <MyInputNumber name="id" label="ID" disabled />
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
      label="Изменить"
      :loading="updateRestaurantMutation.isLoading"
      :disabled="updateRestaurantMutation.isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Restaurant } from '@/interfaces'
import MyUploadFile from '@/components/MyUploadFile.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'

const dialogRef = inject('dialogRef') as any
const restaurant = dialogRef.value.data.restaurant as Restaurant

const toast = useToast()
const queryClient = useQueryClient()

const updateRestaurantMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => axiosPrivate.put('admin/rest', payload),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Ресторан ${variables.name} изменен`
      })
      queryClient.invalidateQueries(['rests'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить ресторан',
        detail: error
      })
    }
  })
)

const { data } = useQuery({
  queryKey: ['rests', { id: restaurant.ID }],
  queryFn: async ({ queryKey }) => {
    const response = await axiosPrivate.get('admin/rest', {
      params: {
        id: (queryKey[1] as any).id
      }
    })

    return response.data
  }
})

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.string().required().label('ID ресторана'),
    name: yup.string().required().label('Название ресторана'),
    address: yup.string().required().label('Адрес ресторана'),
    lat: yup.number().required().label('Широта'),
    lon: yup.number().required().label('Долгота'),
    geojson: yup.string().label('GeoJson')
  }),
  initialValues: data
})

const onSubmit = handleSubmit((v) => {
  updateRestaurantMutation.mutate(v)
})
</script>
