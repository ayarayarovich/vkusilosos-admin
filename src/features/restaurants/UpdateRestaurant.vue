<template>
  <form class="p-2" @submit.prevent="onSubmit">
    <h2 class="mb-4 text-lg font-bold">Общая информация</h2>
    <div class="mb-8 flex gap-4">
      <MyInputNumber name="id" label="ID" disabled />
      <MyInputText name="name" label="Название" />
    </div>

    <h2 class="mb-4 text-lg font-bold">Локация</h2>
    <div class="mb-2 flex gap-4">
      <MyInputText name="adres" label="Адрес" />
    </div>
    <div class="mb-8 flex gap-4">
      <MyInputNumber name="lat" label="Широта" />
      <MyInputNumber name="lng" label="Долгота" />
    </div>

    <h2 class="mb-4 text-lg font-bold">GeoJson</h2>
    <MyUploadFile
      class="mb-8"
      name="geo"
      uploadRoute="admin/upload"
      filenamePropInRequest="file"
      filenamePropInResponse="link"
    />

    <DropdownSelect
      name="active"
      label="Активен"
      placeholder="Выберите"
      :options="[
        {
          label: 'Не активен',
          code: false
        },
        {
          label: 'Активен',
          code: true
        }
      ]"
    >
      <template #value="slotProps">
        <template v-if="slotProps.value">
          <Tag
            v-if="slotProps.value.code === false"
            icon="pi pi-ban"
            :value="slotProps.value.label"
            severity="danger"
          />
          <Tag
            v-else-if="slotProps.value.code === true"
            icon="pi pi-check-circle"
            :value="slotProps.value.label"
            severity="success"
          />
        </template>
      </template>
      <template #option="slotProps">
        <Tag
          v-if="slotProps.option.code === false"
          icon="pi pi-ban"
          :value="slotProps.option.label"
          severity="danger"
        />
        <Tag
          v-else-if="slotProps.option.code === true"
          icon="pi pi-check-circle"
          :value="slotProps.option.label"
          severity="success"
        />
      </template>
    </DropdownSelect>

    <Button
      class="mt-8 flex w-full items-center p-4"
      type="submit"
      label="Изменить"
      :loading="updateRestaurantMutation.isLoading"
      :disabled="updateRestaurantMutation.isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Restaurant } from '@/interfaces'
import MyUploadFile from '@/components/MyUploadFile.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

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
  queryKey: ['rests', { id: restaurant.id }],
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
    adres: yup.string().required().label('Адрес ресторана'),
    lat: yup.number().required().label('Широта'),
    lng: yup.number().required().label('Долгота'),
    geo: yup.string().label('GeoJson'),
    active: yup.boolean().required().label('Активен')
  }),
  initialValues: computed(() => {
    if (data.value) {
      return {
        id: data.value.id,
        name: data.value.name,
        adres: data.value.adres,
        lat: data.value.lat,
        lng: data.value.lng,
        geo: data.value.geo,
        active: data.value.active
      }
    }
    return {}
  })
})

const onSubmit = handleSubmit((v) => {
  updateRestaurantMutation.mutate(v)
})
</script>
