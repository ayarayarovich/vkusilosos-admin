<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Создать тег" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Создать тег" class="max-w-7xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <div class="">
          <div class="w-full mb-8">
            <label for="name" class="block text-900 font-medium mb-2">Название</label>
            <InputText v-bind="name" class="w-full" :class="{ 'p-invalid': errors.name }" />
            <small class="p-error" id="text-error">{{ errors.name || '&nbsp;' }}</small>
          </div>
          <PickList
            v-model="pickListDishes"
            listStyle="height:342px"
            dataKey="id"
            breakpoint="1400px"
          >
            <template #sourceheader> Все блюда </template>
            <template #targetheader> Включенные в тег </template>
            <template #item="slotProps">
              <div class="flex flex-wrap p-2 items-center gap-3">
                <img
                  class="w-[4rem] shadow-md shrink-0 rounded-lg"
                  :src="slotProps.item.img"
                  :alt="slotProps.item.name"
                />
                <div class="flex-1 flex flex-col gap-2">
                  <span class="font-bold">{{ slotProps.item.name }}</span>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-tag text-sm"></i>
                    <span>{{ slotProps.item.category }}</span>
                  </div>
                </div>
                <span class="font-bold text-900">&#8381; {{ slotProps.item.price }}</span>
              </div>
            </template>
          </PickList>
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
import type { Dish } from '@/interfaces'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const toast = useToast()
const queryClient = useQueryClient()

const visible = ref(false)

const schema = yup.object({
  name: yup.string().required().label('Название тега'),
  dishes: yup.array().of(yup.number())
})

const { defineComponentBinds, handleSubmit, setFieldValue, errors } = useForm({
  validationSchema: schema
})

const name = defineComponentBinds('name')

const pickListDishes = ref<Dish[][]>()
const { data: availableDishes, isSuccess: areAvailableDishesLoaded } = useQuery<{
  items: Dish[]
  total: number
}>({
  queryKey: ['dishes'],
  queryFn: async () => {
    const response = await axiosPrivate.get('admin/dishes', {
      params: {
        limit: 999999,
        offset: 0,
        search: ''
      }
    })
    return response.data
  },
  enabled: visible
})

watch([availableDishes], () => {
  if (areAvailableDishesLoaded) {
    pickListDishes.value = [availableDishes.value!.items, []]
  }
})

const createTagMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => axiosPrivate.post('admin/tag', payload),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Создан тег ${variables.name}`
      })
      queryClient.invalidateQueries(['tag'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось создать тег'
      })
    }
  })
)

watch([pickListDishes], () => {
  if (pickListDishes.value) {
    setFieldValue(
      'dishes',
      pickListDishes.value[1].map((item) => item.id)
    )
  }
})

const onSubmit = handleSubmit((v) => {
  createTagMutation.mutate(v)
})
</script>
