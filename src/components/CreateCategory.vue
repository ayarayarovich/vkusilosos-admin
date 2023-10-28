<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Создать категорию" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Создать блюдо" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <div class="grid grid-cols-3 items-center justify-items-center gap-4">
          <div class="w-full">
            <label for="name" class="block text-900 font-medium mb-2">Название</label>
            <InputText id="name" v-model="form.name" type="text" class="w-full" required />
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
import type { CreateCategory } from '@/interfaces'
import { useMutation } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const possibleCardColors = ref([
  { label: 'Белый', code: 'white' },
  { label: 'Оранжевый', code: 'orange' },
  { label: 'Желтый', code: 'yellow' },
  { label: 'Желтозеленый', code: 'yellowgreen' },
  { label: 'Синий', code: 'blue' }
])

const form = reactive<CreateCategory>({
  name: ''
})

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
  createDishMutation.mutate(form)
}

const visible = ref(false)
</script>
