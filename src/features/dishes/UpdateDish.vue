<template>
  <form class="mt-8" @submit="onSubmit">
    <div class="mb-4 grid grid-cols-3 items-center justify-items-center gap-4">
      <MyInputNumber name="id" label="ID" disabled />
      <MyInputText name="name" label="Название" />
      <MyInputText name="description" label="Описание" />
      <MyInputText label="IIKO ID" name="iiko_id" />
      <MyInputNumber label="Вес" name="weight" />
      <MyInputNumber label="Цена" name="price" />
      <MyInputNumber
        label="Пищевая ценность"
        name="pich_cen"
        :min-fraction-digits="0"
        :max-fraction-digits="2"
      />
      <MyInputNumber
        label="Энергетическая ценность"
        name="energ_cen"
        :min-fraction-digits="0"
        :max-fraction-digits="2"
      />
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
              class="aspect-square h-6 rounded-md border-2 border-gray-500"
              :style="{ backgroundColor: slotProps.option.label }"
            ></div>
            <span>{{ slotProps.option.label }}</span>
          </div>
        </template>
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-4">
            <div
              class="aspect-square h-6 rounded-md border-2 border-gray-500"
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

      <MyMultiSelect
        class="w-full"
        name="tags"
        placeholder="Выберите"
        label="Теги"
        :options="possibleTags || []"
      />

      <div class="col-span-1 col-start-1 row-span-2 row-start-1 w-full">
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

    <div class="mb-8 flex flex-wrap items-center justify-center gap-12">
      <MyInputSwitch label="В наличии" :name="`have`" />
      <MyInputSwitch label="Можно доставить" :name="`can_deliver`" />
      <MyInputSwitch label="Активно" :name="`active`" />
    </div>

    <h2 class="mb-6 text-lg font-bold">По ресторанам</h2>
    <MultiSelect
      class="mb-8 w-full"
      display="chip"
      v-model="restaurantsFieldArray"
      :options="restaurantsData || []"
      optionLabel="name"
      data-key="rest_id"
      placeholder="Выберите рестораны"
    />
    <div class="mb-8">
      <fieldset
        v-for="(field, idx) in fields"
        :key="field.value.id"
        class="relative mb-4 rounded-lg border-2 border-gray-200 p-4"
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
            label="ID ресторана"
          />
          <MyInputText class="flex-1" :name="`vars[${idx}].iiko_id`" label="IIKO ID" />
          <MyInputNumber
            class="flex-1"
            :name="`vars[${idx}].price`"
            label="Цена"
            mode="currency"
            currency="RUB"
          />
        </div>
        <div class="flex flex-wrap items-center justify-center gap-12">
          <MyInputSwitch label="В наличии" :name="`vars[${idx}].have`" />
          <MyInputSwitch label="Можно доставить" :name="`vars[${idx}].can_deliver`" />
          <MyInputSwitch label="Активно" :name="`vars[${idx}].active`" />
        </div>
      </fieldset>
    </div>

    <Button
      class="mt-8 flex w-full items-center p-4"
      type="submit"
      label="Сохранить"
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
import { useUpdateDish, useDish } from './composables'
import { useRestaurants } from '@/features/restaurants'
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

const { data: dishData } = useDish(dish.id, (v) => {
  if (v.tags) {
    v.tags = v.tags.map((tag) => tag.id)
  }
  console.log('dishData', v)
  return v
})

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID'),
    name: yup.string().required().label('Название'),
    img: yup.string().required().label('Изображение'),
    price: yup.number().required().label('Цена'),
    category: yup.number().required().label('Категория'),
    color: yup.string().required().label('Цвет карточки'),
    belki: yup.number().required().label('Количество белков'),
    pich_cen: yup.number().required().label('Пищевая ценность'),
    energ_cen: yup.number().required().label('Энергетическая ценность'),
    uglevodi: yup.number().required().label('Количество углеводов'),
    ziri: yup.number().required().label('Количество жиров'),
    weight: yup.number().required().label('Вес'),
    size: yup.number().required().label('Количество'),
    description: yup.string().label('Описание'),
    iiko_id: yup.string().required().label('IIKO ID'),
    tags: yup.array().required().label('Теги'),
    active: yup.boolean().label('Активно'),
    can_deliver: yup.boolean().label('Можно доставить'),
    have: yup.boolean().label('В наличии'),
    vars: yup.array().of(
      yup.object({
        rest_id: yup.number().required().label('ID ресторана'),
        iiko_id: yup.string().required().label('IIKO ID блюда'),
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

const { mutate, isLoading } = useUpdateDish()

const { data: possibleCategories } = useCategories({ offset: 0, limit: 9999999, search: '' }, (r) =>
  r.list.map((v) => ({ label: v.name, code: v.id }))
)
const { data: restaurantsData } = useRestaurants(
  {
    offset: 0,
    limit: 99999999,
    search: ''
  },
  (resp) => {
    return resp.list.map((r) => ({
      rest_id: r.id,
      adres: r.adres,
      name: r.name
    }))
  }
)
const { data: possibleTags } = useTags(
  {
    offset: 0,
    limit: 99999999,
    search: ''
  },
  (r) => r.list.map((v) => ({ label: v.name, code: v.id }))
)

const restaurantsFieldArray = ref<
  {
    rest_id: number
    iiko_id: string
    price: number
    active: boolean
    can_deliver: boolean
    have: boolean
    name: string
    adres: string
  }[]
>()
watch([restaurantsFieldArray], () => {
  if (restaurantsFieldArray.value) {
    console.log('RestaurantsFieldArray', restaurantsFieldArray.value)
    const copy = restaurantsFieldArray.value.map((i) => ({ ...i }))
    replace(copy)
  }
})
watch(
  [restaurantsData, dishData],
  () => {
    if (restaurantsData.value && dishData.value) {
      const arr: typeof restaurantsFieldArray.value = []
      for (const restaurant of restaurantsData.value) {
        if (dishData.value.vars) {
          for (const vr of dishData.value.vars) {
            if (vr.rest_id === restaurant.rest_id) {
              arr.push({
                active: vr.active,
                can_deliver: vr.can_deliver,
                have: vr.have,
                iiko_id: vr.iiko_id,
                price: vr.price,
                rest_id: vr.rest_id,
                name: restaurant.name,
                adres: restaurant.adres
              })
            }
          }
        }
      }
      restaurantsFieldArray.value = arr
    }
  },
  {
    immediate: true
  }
)

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
