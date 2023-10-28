<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button
        label="Изменить"
        :disabled="disabled"
        icon="pi pi-external-link"
        @click="visible = true"
      />
    </div>

    <Dialog v-model:visible="visible" modal :header="`Изменить ${tableSelectionStore.name}`" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <div class="grid grid-cols-3 items-center justify-items-center gap-4">
          <div class="w-full">
            <label for="id" class="block text-900 font-medium mb-2">ID</label>
            <InputNumber id="id" v-model="id" disabled class="w-full" required />
          </div>

          <div class="w-full">
            <label for="name" class="block text-900 font-medium mb-2">Название</label>
            <InputText id="name" v-model="name" type="text" class="w-full" required />
          </div>

          <div class="w-full">
            <label for="category" class="block text-900 font-medium mb-2">Категория</label>
            <InputText id="category" v-model="category" type="text" class="w-full" required />
          </div>

          <div class="w-full">
            <label for="price" class="block text-900 font-medium mb-2">Цена</label>
            <InputNumber
              id="price"
              v-model="price"
              class="w-full"
              mode="currency"
              :min="0"
              currency="RUB"
              required
            />
          </div>

          <div class="w-full">
            <label for="sale_price" class="block text-900 font-medium mb-2">Цена продажи</label>
            <InputNumber
              id="sale_price"
              v-model="sale_price"
              class="w-full"
              mode="currency"
              :min="0"
              currency="RUB"
              required
            />
          </div>

          <div class="w-full">
            <label for="iiko_id" class="block text-900 font-medium mb-2">IIKO_ID</label>
            <InputNumber id="iiko_id" v-model="iiko_id" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="weight" class="block text-900 font-medium mb-2">Вес</label>
            <InputNumber id="weight" v-model="weight" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="energy" class="block text-900 font-medium mb-2">Пищевая ценность</label>
            <InputNumber id="energy" v-model="energy" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="belki" class="block text-900 font-medium mb-2">Белки</label>
            <InputNumber id="belki" v-model="belki" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="ziri" class="block text-900 font-medium mb-2">Жири</label>
            <InputNumber id="ziri" v-model="ziri" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="uglevodi" class="block text-900 font-medium mb-2">Углеводы</label>
            <InputNumber id="uglevodi" v-model="uglevodi" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="size" class="block text-900 font-medium mb-2">Количество</label>
            <InputNumber id="size" v-model="size" class="w-full" :min="0" required />
          </div>

          <div class="w-full">
            <label for="color" class="block text-900 font-medium mb-2">Цвет карточки</label>
            <Dropdown
              class="w-full"
              v-model="selected"
              input-id="color"
              :options="colors"
              optionLabel="label"
              placeholder="Цвет"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center justify-items-center my-8">
          <div class="flex items-center gap-2">
            <label for="have" class="text-900 leading-none font-medium">В наличии</label>
            <Checkbox inputId="have" v-model="have" :binary="true" />
          </div>

          <div class="flex items-center gap-2">
            <label for="can_deliver" class="text-900 leading-none font-medium"
              >Можно доставить</label
            >
            <Checkbox inputId="can_deliver" v-model="can_deliver" :binary="true" />
          </div>

          <div class="flex items-center gap-2">
            <label for="active" class="text-900 leading-none font-medium">Активно</label>
            <Checkbox inputId="active" v-model="active" :binary="true" />
          </div>
        </div>

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Сохранить"
          :loading="updateDishMutation.isLoading"
          :disabled="updateDishMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { UpdateDish } from '@/interfaces'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useTableSelectionStore } from '@/stores/table-selection-store'

const props = defineProps<{
  disabled?: boolean
}>()

const toast = useToast()
const queryClient = useQueryClient()

const colors = ref([
  { label: 'Белый', code: 'white' },
  { label: 'Оранжевый', code: 'orange' },
  { label: 'Желтый', code: 'yellow' },
  { label: 'Желтозеленый', code: 'yellowgreen' },
  { label: 'Синий', code: 'blue' },
])
const selected = ref(colors.value[0])

const id = ref<number>()
const name = ref<string>()
const price = ref<number>()
const sale_price = ref<number>()
const iiko_id = ref<number>()
const weight = ref<number>()
const energy = ref<number>()
const belki = ref<number>()
const ziri = ref<number>()
const uglevodi = ref<number>()
const size = ref<number>()
const have = ref<boolean>()
const can_deliver = ref<boolean>()
const active = ref<boolean>()
const category = ref<string>()

const visible = ref(false)

const tableSelectionStore = useTableSelectionStore()

const { data, isSuccess } = useQuery<UpdateDish>({
  queryKey: ['dishes', tableSelectionStore.id],
  queryFn: async () => {
    const response = await axiosPrivate.get('admin/dish', {
      params: {
        id: tableSelectionStore.id!
      }
    })
    return response.data
  },
  enabled: visible
})

watch([data], () => {
  if (isSuccess && data.value) {
    id.value = data.value.id
    name.value = data.value.name
    price.value = data.value.price
    sale_price.value = data.value.sale_price
    iiko_id.value = data.value.iiko_id
    weight.value = data.value.weight
    energy.value = data.value.energy
    belki.value = data.value.belki
    ziri.value = data.value.ziri
    uglevodi.value = data.value.uglevodi
    size.value = data.value.size
    have.value = data.value.have
    can_deliver.value = data.value.can_deliver
    active.value = data.value.active
    category.value = data.value.category.name
  }
})

const updateDishMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosPrivate.put('admin/dish', payload)
      return response.data
    },
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Изменено блюдо ${variables.name}`
      })
      queryClient.invalidateQueries(['dishes'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить блюдо'
      })
    }
  })
)

const onSubmit = (e: Event) => {
  updateDishMutation.mutate({
    id: id.value,
    name: name.value,
    price: price.value,
    sale_price: sale_price.value,
    iiko_id: iiko_id.value,
    weight: weight.value,
    energy: energy.value,
    belki: belki.value,
    ziri: ziri.value,
    uglevodi: uglevodi.value,
    size: size.value,
    have: have.value,
    can_deliver: can_deliver.value,
    active: active.value,
    color: selected.value.code,
    category: {
      name: category.value,
      img: ''
    }
  })
}
</script>