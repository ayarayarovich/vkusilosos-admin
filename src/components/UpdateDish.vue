<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Изменить блюдо" :disabled="disabled" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Изменить блюдо" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit="onSubmit">
        <div class="grid grid-cols-3 items-center justify-items-center gap-4 mb-4">
          <MyInputText name="name" label="Название" />
          <MyInputNumber name="price" label="Цена" mode="currency" currency="RUB" />
          <MyInputNumber label="Цена продажи" name="sale_price" />
          <MyInputNumber label="IIKO ID" name="iiko_id" />
          <MyInputNumber label="Вес" name="weight" />
          <MyInputNumber label="Пищевая ценность" name="energy" />
          <MyInputNumber label="Белки" name="belki" />
          <MyInputNumber label="Жиры" name="ziri" />
          <MyInputNumber label="Углеводы" name="uglevodi" />
          <MyInputNumber label="Количество" name="size" />

          <DropdownSelect
            class="w-full"
            name="color"
            label="Цвет карточки"
            placeholder="Выберите"
            :options="possibleCardColors"
          />

          <DropdownSelect
            class="w-full"
            name="category_id"
            label="Категория"
            placeholder="Выберите"
            :options="possibleCategories"
          />

          <div class="col-start-1 col-span-1 row-start-1 row-span-3 w-full h-full">
            <MyUploadImage
              class="rounded-lg"
              name="img"
              filename-prop-in-request="image"
              filename-prop-in-response="fileLink"
              upload-route="admin/upload"
            />
          </div>
        </div>

        <h2 class="text-lg mb-6 font-bold">По ресторанам</h2>
        <div class="mb-8">
          <fieldset
            v-for="(field, idx) in fields"
            :key="field.key"
            class="relative border-2 border-gray-200 rounded-lg p-4 mb-4"
          >
            <h3 class="absolute top-0 -translate-y-1/2 bg-white px-3 font-semibold">
              "{{ field.value.name }}" - {{ field.value.address }}
            </h3>
            <div class="flex gap-4">
              <MyInputNumber
                disabled
                class="flex-1"
                :name="`restaurants[${idx}].restaurant_id`"
                label="ID ресторана"
                :initial-value="field.value.id"
              />
              <MyInputNumber class="flex-1" :name="`restaurants[${idx}].iiko_id`" label="IIKO ID" />
              <MyInputNumber
                class="flex-1"
                :name="`restaurants[${idx}].price`"
                label="Цена"
                mode="currency"
                currency="RUB"
              />
            </div>
          </fieldset>
        </div>

        <div>
          <MyInputSwitch label="В наличии" name="have" />
          <MyInputSwitch label="Можно доставить" name="can_deliver" />
          <MyInputSwitch label="Активно" name="active" />
        </div>

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Создать"
          :loading="updateDishMutation.isLoading"
          :disabled="updateDishMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Dish, Category, Restaurant } from '@/interfaces'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch, toRefs, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import * as yup from 'yup'
import { useForm, useFieldArray } from 'vee-validate'
import MyInputNumber from './MyInputNumber.vue'
import MyInputSwitch from './MyInputSwitch.vue'
import MyInputText from './MyInputText.vue'
import MyUploadImage from './MyUploadImage.vue'
import DropdownSelect from './DropdownSelect.vue'

const props = defineProps<{
  disabled?: boolean
  dish?: Dish
}>()

const visible = ref(false)

const { disabled } = toRefs(props)

const toast = useToast()
const queryClient = useQueryClient()
const possibleCardColors = ref([
  { label: 'Белый', code: 'white' },
  { label: 'Оранжевый', code: 'orange' },
  { label: 'Желтый', code: 'yellow' },
  { label: 'Желтозеленый', code: 'yellowgreen' },
  { label: 'Синий', code: 'blue' }
])

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required().label('Название'),
    img: yup.string().required().label('Изображение'),
    category_id: yup.number().required().label('Категория'),
    color: yup.string().required().label('Цвет карточки'),
    belki: yup.number().required().label('Количество белков'),
    energy: yup.number().required().label('Пищевая ценность'),
    uglevodi: yup.number().required().label('Количество углеводов'),
    ziri: yup.number().required().label('Количество жиров'),
    weight: yup.number().required().label('Вес'),
    size: yup.number().required().label('Количество'),
    active: yup.boolean().label('Активно'),
    can_deliver: yup.boolean().label('Можно доставить'),
    have: yup.boolean().label('В наличии'),
    description: yup.string().label('Описание'),
    price: yup.number().required().label('Цена'),
    sale_price: yup.number().required().label('Цена продажи'),
    iiko_id: yup.number().required().label('IIKO ID'),
    restaurants: yup.array().of(
      yup.object({
        restaurant_id: yup.number().required().label('ID ресторана'),
        iiko_id: yup.number().required().label('IIKO ID блюда'),
        price: yup.number().required().label('Цена')
      })
    )
  })
})

const { replace, fields } = useFieldArray<Restaurant>('restaurants')

const updateDishMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => {
      // const response = axiosPrivate.put('admin/dish', payload)
      const response = Promise.reject('GET /admin/dish route not implemented properly')
      return response
    },
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Обновлено блюдо ${variables.name}`
      })
      queryClient.invalidateQueries(['dishes'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось обновить блюдо',
        detail: error
      })
    }
  })
)

const { data: categoriesData } = useQuery<{
  items: Category[]
  total: number
}>({
  queryKey: ['categories'],
  queryFn: async () => {
    const response = await axiosPrivate.get('admin/categories', {
      params: {
        limit: 99999999,
        offset: 0
      }
    })
    return response.data
  },
  enabled: visible
})

const possibleCategories = computed(() => {
  if (categoriesData.value) {
    return categoriesData.value.items.map((item) => ({
      label: item.name,
      code: item.id
    }))
  }
  return []
})

const { data: restaurantsData } = useQuery<{
  items: Restaurant[]
  total: number
}>({
  queryKey: ['restaurants'],
  queryFn: async () => {
    const response = await axiosPrivate.get('admin/rests', {
      params: {
        limit: 999999999,
        offset: 0
      }
    })
    return response.data
  },
  enabled: visible
})
watch([restaurantsData], () => {
  if (restaurantsData.value) {
    replace(
      restaurantsData.value.items.map((item) => ({
        ...item
      }))
    )
  }
})

const onSubmit = handleSubmit((vals) => {
  updateDishMutation.mutate(vals)
})
</script>
