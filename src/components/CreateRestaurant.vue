<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Создать ресторан" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Создать ресторан" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <h2 class="text-lg font-medium mb-4">Общая информация</h2>
        <div class="flex gap-4 mb-8">
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

        <h2 class="text-lg font-medium mb-4">GeoJson</h2>
        <div class="flex gap-4 mb-8 items-center">
          <FileUpload
            name="geojson"
            :auto="true"
            mode="basic"
            customUpload
            @uploader="fileUploader"
          />
          <small v-if="values.geojson">{{ values.geojson }}</small>
        </div>

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Создать"
          :loading="createTagMutation.isLoading"
          :disabled="createTagMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'

const toast = useToast()
const queryClient = useQueryClient()

const schema = yup.object({
  name: yup.string().required().label('Название ресторана'),
  address: yup.string().required().label('Адрес ресторана'),
  lat: yup.number().required().label('Широта'),
  lon: yup.number().required().label('Долгота'),
  geojson: yup.string().required().label('GeoJson')
})

const { defineComponentBinds, handleSubmit, setFieldValue, errors, values } = useForm({
  validationSchema: schema
})

const name = defineComponentBinds('name')
const address = defineComponentBinds('address')
const lat = defineComponentBinds('lat')
const lon = defineComponentBinds('lon')

const isFileUploading = ref(false)
const isFileUploaded = ref(false)

const createTagMutation = reactive(
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
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось создать ресторан'
      })
    }
  })
)

const onSubmit = handleSubmit((v) => {
  createTagMutation.mutate(v)
})

const fileUploader = (e: FileUploadUploaderEvent) => {
  const files = e.files as any
  const formData = new FormData()
  formData.append('geojson', files[0])
  isFileUploading.value = true
  isFileUploaded.value = false
  axiosPrivate
    .post('admin/geojson', formData)
    .then((response) => {
      setFieldValue('geojson', response.data.geoJsonName)
      isFileUploaded.value = true
      toast.add({
        severity: 'success',
        life: 3000,
        summary: `GeoJson загружен (${response.data.geoJsonName})`
      })
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось загрузить файл',
        detail: error
      })
    })
    .finally(() => {
      isFileUploading.value = false
    })
}

const visible = ref(false)
</script>
