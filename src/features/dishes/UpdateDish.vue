<template>
  <form class="mt-8" @submit="onSubmit">
    <div class="grid grid-cols-3 items-center justify-items-center gap-4 mb-4">
      <MyInputText name="name" label="Название" />
      <MyInputText name="description" label="Описание" />
      <MyInputText label="IIKO id" name="iiko_id" />
      <MyInputNumber label="Вес" name="weight" />
      <MyInputNumber label="Цена" name="price" />
      <MyInputNumber label="Пищевая ценность" name="pich_cen" />
      <MyInputNumber label="Белки" name="belki" />
      <MyInputNumber label="Жиры" name="ziri" />
      <MyInputNumber label="Углеводы" name="uglevodi" />

      <DropdownSelect
        class="w-full"
        name="color"
        label="Цвет карточки"
        placeholder="Выберите"
        :options="possibleCardColors"
      >
        <template #option="slotProps">
          <div class="flex items-center gap-4">
            <div
              class="h-6 aspect-square rounded-md border-2 border-gray-500"
              :style="{ backgroundColor: slotProps.option.label }"
            ></div>
            <span>{{ slotProps.option.label }}</span>
          </div>
        </template>
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-4">
            <div
              class="h-6 aspect-square rounded-md border-2 border-gray-500"
              :style="{ backgroundColor: slotProps.value.label }"
            ></div>
            <span>{{ slotProps.value.label }}</span>
          </div>
          <span v-else> Выберите </span>
        </template>
      </DropdownSelect>

      <DropdownSelect
        class="w-full"
        name="size"
        label="Размер карточки"
        placeholder="Выберите"
        :options="[
          {
            label: 'Маленький',
            code: 1
          },
          {
            label: 'Большой',
            code: 2
          }
        ]"
      >
      </DropdownSelect>

      <DropdownSelect
        class="w-full"
        name="category"
        label="Категория"
        placeholder="Выберите"
        :options="possibleCategories || []"
      />

      <MyMultiSelect class="w-full" name="tags" label="Теги" :options="possibleTags || []" />

      <div class="col-start-1 col-span-1 row-start-1 row-span-3 w-full">
        <MyUploadImage
          class="rounded-lg"
          name="img"
          :aspect-ratio="4 / 3"
          filename-prop-in-request="file"
          filename-prop-in-response="link"
          upload-route="admin/upload"
        />
      </div>
    </div>

    <div class="flex items-center justify-center gap-12 mb-8 flex-wrap">
      <MyInputSwitch label="В наличии" :name="`have`" />
      <MyInputSwitch label="Можно доставить" :name="`can_deliver`" />
      <MyInputSwitch label="Активно" :name="`active`" />
    </div>

    <h2 class="text-lg mb-6 font-bold">По ресторанам</h2>
    <MultiSelect
      class="mb-8 w-full"
      display="chip"
      v-model="selectedRestaurants"
      :options="restaurantsData || []"
      optionLabel="name"
      placeholder="Выберите рестораны"
    />
    <div class="mb-8">
      <fieldset
        v-for="(field, idx) in fields"
        :key="field.value.id"
        class="relative border-2 border-gray-200 rounded-lg p-4 mb-4"
      >
        <h3 class="absolute top-0 -translate-y-1/2 bg-white px-3 font-semibold">
          "{{ field.value.name }}" - {{ field.value.adres }}
        </h3>
        <div class="flex gap-4">
          <MyInputNumber
            class="flex-1"
            :name="`vars[${idx}].rest_id`"
            :initial-value="field.value.id"
            disabled
            label="id ресторана"
          />
          <MyInputNumber class="flex-1" :name="`vars[${idx}].iiko_id`" label="IIKO id" />
          <MyInputNumber
            class="flex-1"
            :name="`vars[${idx}].price`"
            label="Цена"
            mode="currency"
            currency="RUB"
          />
        </div>
        <div class="flex items-center justify-center gap-12 flex-wrap">
          <MyInputSwitch label="В наличии" :name="`vars[${idx}].have`" />
          <MyInputSwitch label="Можно доставить" :name="`vars[${idx}].can_deliver`" />
          <MyInputSwitch label="Активно" :name="`vars[${idx}].active`" />
        </div>
      </fieldset>
    </div>

    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Создать"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import MyUploadImage from '@/components/MyUploadImage.vue'
import { useFieldArray, useForm } from 'vee-validate'
import * as yup from 'yup'

import DropdownSelect from '@/components/DropdownSelect.vue'
import MyInputText from '@/components/MyInputText.vue'
import MyInputNumber from '@/components/MyInputNumber.vue'
import MyInputSwitch from '@/components/MyInputSwitch.vue'

import { useCategories } from '@/features/categories'
import { useCreateDish, useDish } from './composables'
import { useRestaurants, type IRestaurant } from '@/features/restaurants'
import { useTags } from '@/features/tags'
import MyMultiSelect from '@/components/MyMultiSelect.vue'
import type { IDish } from './interfaces'

const dialogRef = inject('dialogRef') as any
const dish = dialogRef.value.data.dish as IDish

const possibleCardColors = ref([
  { label: '#FAFAFA', code: 1 },
  { label: '#FADEC3', code: 2 },
  { label: '#E6F0F8', code: 3 },
  { label: '#F0EDBA', code: 4 },
  { label: '#FEEDB1', code: 5 }
])

const { data: dishData } = useDish(dish.id, (v) => v)

const { handleSubmit, errors } = useForm({
  validationSchema: yup.object({
    name: yup.string().required().label('Название'),
    img: yup.string().required().label('Изображение'),
    price: yup.number().required().label('Цена'),
    category: yup.number().required().label('Категория'),
    color: yup.string().required().label('Цвет карточки'),
    belki: yup.number().required().label('Количество белков'),
    pich_cen: yup.number().required().label('Пищевая ценность'),
    uglevodi: yup.number().required().label('Количество углеводов'),
    ziri: yup.number().required().label('Количество жиров'),
    weight: yup.number().required().label('Вес'),
    size: yup.number().required().label('Количество'),
    description: yup.string().label('Описание'),
    iiko_id: yup.string().required().label('IIKO id'),
    tags: yup.array().required().label('Теги'),
    active: yup.boolean().label('Активно'),
    can_deliver: yup.boolean().label('Можно доставить'),
    have: yup.boolean().label('В наличии'),
    vars: yup.array().of(
      yup.object({
        rest_id: yup.number().required().label('id ресторана'),
        iiko_id: yup.number().required().label('IIKO id блюда'),
        price: yup.number().required().label('Цена'),
        active: yup.boolean().label('Активно'),
        can_deliver: yup.boolean().label('Можно доставить'),
        have: yup.boolean().label('В наличии')
      })
    )
  }),
  initialValues: dishData
})

const { replace, fields } = useFieldArray<any>('vars')

const { mutate, isLoading } = useCreateDish()

const { data: possibleCategories } = useCategories({ offset: 0, limit: 9999999, search: '' }, (r) =>
  r.list.map((v) => ({ label: v.name, code: v.id }))
)
const { data: restaurantsData } = useRestaurants(
  {
    offset: 0,
    limit: 99999999,
    search: ''
  },
  (r) => r.list
)
const { data: possibleTags } = useTags(
  {
    offset: 0,
    limit: 99999999,
    search: ''
  },
  (r) => r.list.map((v) => ({ label: v.name, code: v.id }))
)

const selectedRestaurants = ref<IRestaurant[]>()
watch([selectedRestaurants], () => {
  if (selectedRestaurants.value) {
    const copy = selectedRestaurants.value.map((item) => ({ ...item }))
    replace(copy)
  }
})
watch([restaurantsData], () => {
  selectedRestaurants.value = restaurantsData.value?.filter((vs) => {
    for (let i = 0; i < dish.vars.length; ++i) {
      if (dish.vars[i].rest_id == vs.id) {
        return true
      }
    }
    return false
  })
})

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
