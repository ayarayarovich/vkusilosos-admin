<template>
  <div>
    <p class="mb-8 text-lg leading-loose">
      Вы уверены, что хотите удалить категорию
      <span class="min-w-max inline-block font-bold px-4 rounded-lg bg-purple-200 whitespace-nowrap"
        >{{ category.name }} (id: {{ category.id }})</span
      >
    </p>
    <div class="flex justify-end gap-4">
      <Button label="Нет" severity="secondary" @click="dialogRef.close()" />
      <Button label="Да" severity="danger" @click="deleteCategory()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { inject, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { Category } from '@/interfaces'

const dialogRef = inject('dialogRef') as any
const category = dialogRef.value.data.category as Category
console.log(dialogRef.value.data.category.id)

const toast = useToast()
const queryClient = useQueryClient()

const deleteMutation = reactive(
  useMutation({
    mutationFn: () => Promise.reject('Category deletion route not implemented.'),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удалена категория ${dialogRef.value.data.category.name} (id: ${dialogRef.value.data.category.id})`
      })
      queryClient.invalidateQueries(['categories'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось удалить категорию',
        detail: error
      })
    }
  })
)

const deleteCategory = () => {
  deleteMutation.mutate()
  dialogRef.value.close()
}
</script>
