<template>
  <div>
    <p class="mb-8 text-lg leading-loose">
      Вы уверены, что хотите удалить категорию
      <span class="min-w-max inline-block font-bold px-4 rounded-lg bg-purple-200 whitespace-nowrap"
        >{{ category.name }} (id: {{ category.ID }})</span
      >
    </p>
    <div class="flex justify-end gap-4">
      <Button
        class="flex-1"
        size="small"
        label="Нет"
        :disabled="isLoading"
        severity="secondary"
        @click="dialogRef.close()"
      />
      <Button
        class="flex-1"
        size="small"
        label="Да"
        :loading="isLoading"
        :disabled="isLoading"
        severity="danger"
        @click="deleteCategory()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useDeleteCategory } from './composables'
import type { ICategory } from './interfaces'

const dialogRef = inject('dialogRef') as any
const category = dialogRef.value.data.category as ICategory

const { mutateAsync, isLoading } = useDeleteCategory()

const deleteCategory = () => {
  mutateAsync({
    id: category.ID,
    name: category.name
  }).then(() => {
    dialogRef.value.close()
  })
}
</script>
