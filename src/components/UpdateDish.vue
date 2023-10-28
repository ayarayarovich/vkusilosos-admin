<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="`Изменить ${dishName} (id: ${dishID})`"
    class="max-w-4xl w-full m-4"
  >
    <form class="p-2" @submit.prevent="onSubmit">
      <div class="grid grid-cols-3 items-center justify-items-center gap-4">
        <div class="w-full">
          <label for="id" class="block text-900 font-medium mb-2">ID</label>
          <InputNumber id="id" v-model="form.id" disabled class="w-full" required />
        </div>

        <div class="w-full">
          <label for="name" class="block text-900 font-medium mb-2">Название</label>
          <InputText id="name" v-model="form.name" type="text" class="w-full" required />
        </div>

        <div class="w-full">
          <label for="category" class="block text-900 font-medium mb-2">Категория</label>
          <InputText
            id="category"
            v-model="form.category.name"
            type="text"
            class="w-full"
            required
          />
        </div>

        <div class="w-full">
          <label for="price" class="block text-900 font-medium mb-2">Цена</label>
          <InputNumber
            id="price"
            v-model="form.price"
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
            v-model="form.sale_price"
            class="w-full"
            mode="currency"
            :min="0"
            currency="RUB"
            required
          />
        </div>

        <div class="w-full">
          <label for="iiko_id" class="block text-900 font-medium mb-2">IIKO_ID</label>
          <InputNumber id="iiko_id" v-model="form.iiko_id" class="w-full" :min="0" required />
        </div>

        <div class="w-full">
          <label for="weight" class="block text-900 font-medium mb-2">Вес</label>
          <InputNumber id="weight" v-model="form.weight" class="w-full" :min="0" required />
        </div>

        <div class="w-full">
          <label for="energy" class="block text-900 font-medium mb-2">Пищевая ценность</label>
          <InputNumber id="energy" v-model="form.energy" class="w-full" :min="0" required />
        </div>

        <div class="w-full">
          <label for="belki" class="block text-900 font-medium mb-2">Белки</label>
          <InputNumber id="belki" v-model="form.belki" class="w-full" :min="0" required />
        </div>

        <div class="w-full">
          <label for="ziri" class="block text-900 font-medium mb-2">Жири</label>
          <InputNumber id="ziri" v-model="form.ziri" class="w-full" :min="0" required />
        </div>

        <div class="w-full">
          <label for="uglevodi" class="block text-900 font-medium mb-2">Углеводы</label>
          <InputNumber id="uglevodi" v-model="form.uglevodi" class="w-full" :min="0" required />
        </div>

        <div class="w-full">
          <label for="size" class="block text-900 font-medium mb-2">Количество</label>
          <InputNumber id="size" v-model="form.size" class="w-full" :min="0" required />
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
          <Checkbox inputId="have" v-model="form.have" :binary="true" />
        </div>

        <div class="flex items-center gap-2">
          <label for="can_deliver" class="text-900 leading-none font-medium">Можно доставить</label>
          <Checkbox inputId="can_deliver" v-model="form.can_deliver" :binary="true" />
        </div>

        <div class="flex items-center gap-2">
          <label for="active" class="text-900 leading-none font-medium">Активно</label>
          <Checkbox inputId="active" v-model="form.active" :binary="true" />
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
</template>

<script setup lang="ts">
import type { UpdateDish } from '@/interfaces'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import emitter from '@/emmiter'

const toast = useToast()
const queryClient = useQueryClient()

const colors = ref([
  { label: 'Белый', code: 'white' },
  { label: 'Оранжевый', code: 'orange' },
  { label: 'Желтый', code: 'yellow' },
  { label: 'Желтозеленый', code: 'yellowgreen' },
  { label: 'Синий', code: 'blue' }
])
const selected = ref(colors.value[0])

const form = reactive({
  id: undefined as undefined | number,
  name: undefined as undefined | string,
  price: undefined as undefined | number,
  sale_price: undefined as undefined | number,
  iiko_id: undefined as undefined | number,
  weight: undefined as undefined | number,
  energy: undefined as undefined | number,
  belki: undefined as undefined | number,
  ziri: undefined as undefined | number,
  uglevodi: undefined as undefined | number,
  size: undefined as undefined | number,
  have: undefined as undefined | boolean,
  can_deliver: undefined as undefined | boolean,
  active: undefined as undefined | boolean,
  color: selected.value.code,
  category: {
    name: undefined as undefined | string,
    img: undefined as undefined | string
  }
})
watch([selected], () => {
  form.color = selected.value.code
})

const visible = ref(false)

const dishID = ref<number>()
const dishName = ref<string>()

emitter.on('Dishes.Edit', (e) => {
  ;(dishID.value = e.id), (dishName.value = e.name)
  visible.value = true
})

const { data, isSuccess } = useQuery<UpdateDish>({
  queryKey: ['dishes', dishID],
  queryFn: async () => {
    const response = await axiosPrivate.get('admin/dish', {
      params: {
        id: dishID.value
      }
    })
    return response.data
  },
  enabled: visible
})

watch([data], () => {
  if (isSuccess && data.value) {
    Object.assign(form, data.value)
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
  updateDishMutation.mutate(form)
}
</script>
