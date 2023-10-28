<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="`Изменить ${categoryName} (id: ${categoryID})`"
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
      </div>

      <Button
        class="w-full flex items-center p-4 mt-8"
        type="submit"
        label="Сохранить"
        :loading="updateCategoryMutation.isLoading"
        :disabled="updateCategoryMutation.isLoading"
      />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import emitter from '@/emmiter'

const toast = useToast()
const queryClient = useQueryClient()

const form = reactive({
  id: undefined as number | undefined,
  name: undefined as string | undefined
})
const visible = ref(false)

const categoryID = ref<number>()
const categoryName = ref<string>()
emitter.on('Categories.Edit', (e) => {
  Object.assign(form, e)
  categoryID.value = e.id
  categoryName.value = e.name
  visible.value = true
})

const updateCategoryMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosPrivate.put('admin/category', payload)
      return response.data
    },
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Изменена категория ${variables.name} (id: ${variables.id})`
      })
      queryClient.invalidateQueries(['categories'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить категорию'
      })
    }
  })
)

const onSubmit = (e: Event) => {
  updateCategoryMutation.mutate(form)
}
</script>
