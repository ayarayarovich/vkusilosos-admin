<template>
  <div>
    <p class="mb-8 text-lg leading-loose">
      Вы уверены, что хотите удалить тег
      <span class="min-w-max inline-block font-bold px-4 rounded-lg bg-indigo-100 whitespace-nowrap"
        >{{ tag.name }} (id: {{ tag.id }})</span
      >
    </p>
    <div class="flex justify-end gap-4">
      <Button label="Нет" class="flex-1" severity="secondary" @click="dialogRef.close()" />
      <Button label="Да" class="flex-1" severity="danger" @click="deleteTag()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { inject, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { Tag } from '@/interfaces'

const toast = useToast()
const queryClient = useQueryClient()

const dialogRef = inject('dialogRef') as any
const tag = dialogRef.value.data.tag as Tag

const deleteMutation = reactive(
  useMutation({
    mutationFn: () => Promise.reject('Tag deletion route not implemented.'),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удален ресторан ${tag.name} (id: ${tag.id})`
      })
      queryClient.invalidateQueries(['tags'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось удалить тег',
        detail: error
      })
    }
  })
)

const deleteTag = () => {
  deleteMutation.mutate()
  dialogRef.value.close()
}
</script>
