<template>
  <form class="p-2" @submit.prevent="onSubmit">
    <h2 class="mb-4 text-lg font-bold">Общая информация</h2>
    <div class="mb-8 flex gap-4">
      <MyInputText name="name" label="Название" />
    </div>

    <h2 class="mb-4 text-lg font-bold">Локация</h2>
    <div class="mb-2 flex gap-4">
      <MyInputText name="adres" label="Адрес" />
    </div>
    <div class="mb-8 flex gap-4">
      <MyInputNumber name="lat" label="Широта" :minFractionDigits="2" :maxFractionDigits="6" />
      <MyInputNumber name="lng" label="Долгота" :minFractionDigits="2" :maxFractionDigits="6" />
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
      label="Создать"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyUploadFile from '@/components/MyUploadFile.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useCreateRestaurant } from './composables'

const schema = yup.object({
  name: yup.string().required().label('Название ресторана'),
  adres: yup.string().required().label('Адрес ресторана'),
  lat: yup.number().required().label('Широта'),
  lng: yup.number().required().label('Долгота'),
  geo: yup.string().required().label('GeoJson')
})

const { handleSubmit } = useForm({
  validationSchema: schema
})

const { mutate, isLoading } = useCreateRestaurant()

const onSubmit = handleSubmit((v) => {
  mutate(v)
})
</script>
