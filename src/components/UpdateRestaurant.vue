<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="`Изменить ${restaurantName} (id: ${restaurantID})`"
    class="max-w-4xl w-full m-4"
  >
    <form class="p-2" @submit="onSubmit">
      <h2 class="text-lg font-medium mb-4">Общая информация</h2>
      <div class="flex gap-4 mb-8">
        <div class="w-full">
          <label for="id" class="block text-900 font-medium mb-2">Название</label>
          <InputText v-bind="id" class="w-full" :class="{ 'p-invalid': errors.id }" />
          <small class="p-error" id="text-error">{{ errors.id || '&nbsp;' }}</small>
        </div>
        <div class="w-full">
          <label for="name" class="block text-900 font-medium mb-2">Название</label>
          <InputText v-bind="name" class="w-full" :class="{ 'p-invalid': errors.name }" />
          <small class="p-error" id="text-error">{{ errors.name || '&nbsp;' }}</small>
        </div>
      </div>

      <h2 class="text-lg font-medium mb-4">Локация</h2>
      <div class="flex gap-4 mb-2">
        <div class="w-full">
          <label for="address" class="block text-900 font-medium mb-2">Адрес</label>
          <InputText v-bind="address" class="w-full" :class="{ 'p-invalid': errors.address }" />
          <small class="p-error" id="text-error">{{ errors.address || '&nbsp;' }}</small>
        </div>
      </div>
      <div class="flex gap-4 mb-8">
        <div class="w-full">
          <label for="lat" class="block text-900 font-medium mb-2">Широта</label>
          <InputNumber
            v-bind="lat"
            class="w-full"
            :class="{ 'p-invalid': errors.lat }"
            :minFractionDigits="0"
            :maxFractionDigits="100"
          />
          <small class="p-error" id="text-error">{{ errors.lat || '&nbsp;' }}</small>
        </div>
        <div class="w-full">
          <label for="lon" class="block text-900 font-medium mb-2">Долгота</label>
          <InputNumber
            v-bind="lon"
            class="w-full"
            :class="{ 'p-invalid': errors.lon }"
            :minFractionDigits="0"
            :maxFractionDigits="100"
          />
          <small class="p-error" id="text-error">{{ errors.lon || '&nbsp;' }}</small>
        </div>
      </div>

      <Button
        class="w-full flex items-center p-4 mt-8"
        type="submit"
        label="Сохранить"
        :loading="updateRestaurantMutation.isLoading.value"
        :disabled="updateRestaurantMutation.isLoading.value"
      />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import emitter from '@/emmiter'

const toast = useToast()
const queryClient = useQueryClient()

const visible = ref(false)

const schema = yup.object({
  id: yup.string().required().label('ID ресторана'),
  name: yup.string().required().label('Название ресторана'),
  address: yup.string().required().label('Адрес ресторана'),
  lat: yup.number().required().label('Широта'),
  lon: yup.number().required().label('Долгота'),
  geojson: yup.string().label('GeoJson')
})

const { defineComponentBinds, handleSubmit, errors, setValues } = useForm({
  validationSchema: schema
})

const id = defineComponentBinds('id')
const name = defineComponentBinds('name')
const address = defineComponentBinds('address')
const lat = defineComponentBinds('lat')
const lon = defineComponentBinds('lon')

const restaurantID = ref<number>()
const restaurantName = ref<string>()
emitter.on('Restaurants.Edit', (e) => {
  restaurantID.value = e.id
  restaurantName.value = e.name
  visible.value = true
})

const updateRestaurantMutation = useMutation({
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
  onError() {
    toast.add({
      severity: 'error',
      life: 3000,
      summary: 'Не удалось изменить ресторан'
    })
  }
})

const { data, status } = useQuery({
  queryKey: ['rests', { id: restaurantID }],
  queryFn: async ({ queryKey }) => {
    const response = await axiosPrivate.get('admin/rest', {
      params: {
        id: (queryKey[1] as any).id
      }
    })

    return response.data
  },
  enabled: visible
})
watch([data, status], () => {
  if (status.value === 'success') {
    setValues({
      name: data.value.name,
      id: data.value.id,
      address: data.value.address,
      lat: data.value.lat,
      lon: data.value.lon,
    })
  }
})

const onSubmit = handleSubmit((v) => {
  updateRestaurantMutation.mutate(v)
})
</script>
