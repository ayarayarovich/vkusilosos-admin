<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Создать блюдо" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Создать блюдо" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <div class="grid grid-cols-3 items-center justify-items-center gap-4">
          <div class="w-full">
            <label for="name" class="block text-900 font-medium mb-2">Название</label>
            <InputText id="name" v-model="payload.name" type="text" class="w-full" required />
          </div>

          <div class="w-full">
            <label for="price" class="block text-900 font-medium mb-2">Цена</label>
            <InputNumber
              id="price"
              v-model="payload.price"
              type="text"
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
              v-model="payload.sale_price"
              type="text"
              class="w-full"
              mode="currency"
              :min="0"
              currency="RUB"
              required
            />
          </div>

          <div class="w-full">
            <label for="iiko_id" class="block text-900 font-medium mb-2">IIKO_ID</label>
            <InputNumber
              id="iiko_id"
              v-model="payload.iiko_id"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="weight" class="block text-900 font-medium mb-2">Вес</label>
            <InputNumber
              id="weight"
              v-model="payload.weight"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="energy" class="block text-900 font-medium mb-2">Пищевая ценность</label>
            <InputNumber
              id="energy"
              v-model="payload.energy"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="belki" class="block text-900 font-medium mb-2">Белки</label>
            <InputNumber
              id="belki"
              v-model="payload.belki"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="ziri" class="block text-900 font-medium mb-2">Жири</label>
            <InputNumber
              id="ziri"
              v-model="payload.ziri"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="uglevodi" class="block text-900 font-medium mb-2">Углеводы</label>
            <InputNumber
              id="uglevodi"
              v-model="payload.uglevodi"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="size" class="block text-900 font-medium mb-2">Количество</label>
            <InputNumber
              id="size"
              v-model="payload.size"
              type="text"
              class="w-full"
              :min="0"
              required
            />
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
            <Checkbox inputId="have" v-model="payload.have" :binary="true" />
          </div>

          <div class="flex items-center gap-2">
            <label for="can_deliver" class="text-900 leading-none font-medium"
              >Можно доставить</label
            >
            <Checkbox inputId="can_deliver" v-model="payload.can_deliver" :binary="true" />
          </div>

          <div class="flex items-center gap-2">
            <label for="active" class="text-900 leading-none font-medium">Активно</label>
            <Checkbox inputId="active" v-model="payload.active" :binary="true" />
          </div>
        </div>

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Создать"
          :loading="createDishMutation.isLoading"
          :disabled="createDishMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { CreateDish } from '@/interfaces'
import { useMutation } from '@tanstack/vue-query'
import { ref, reactive, watch } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'


const toast = useToast()

const colors = ref([
  { label: 'Белый', code: 'white' },
  { label: 'Оранжевый', code: 'orange' },
  { label: 'Желтый', code: 'yellow' },
  { label: 'Желтозеленый', code: 'yellowgreen' },
  { label: 'Синий', code: 'blue' },
])
const selected = ref(colors.value[0])

const payload = reactive<CreateDish>({
  active: true,
  belki: 0,
  can_deliver: true,
  category: {
    name: '',
    img: ''
  },
  color: '',
  count: 0,
  description: '',
  energy: 0,
  have: true,
  iiko_id: 0,
  img: '',
  name: '',
  price: 0,
  sale_price: 0,
  size: 0,
  uglevodi: 0,
  weight: 0,
  ziri: 0
})

watch([selected], () => (payload.color = selected.value.code))

const createDishMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => axiosPrivate.put('admin/dish', payload),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Добавлено блюдо ${variables.name}`
      })
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось создать блюдо'
      })
    }
  })
)

const onSubmit = (e: Event) => {
  createDishMutation.mutate(payload)
}

const visible = ref(false)
</script>
