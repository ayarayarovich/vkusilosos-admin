<template>
  <div>
    <p class="mb-8 text-lg leading-loose">
      Вы уверены, что хотите удалить баннер
      <span class="min-w-max inline-block font-bold px-4 rounded-lg bg-purple-200 whitespace-nowrap"
        >id: {{ banner.id }}</span
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
import { useDeleteBanner } from './composables'
import type { IBanner } from './interfaces'

const dialogRef = inject('dialogRef') as any
const banner = dialogRef.value.data.banner as IBanner

const { mutateAsync, isLoading } = useDeleteBanner()

const deleteCategory = () => {
  mutateAsync({
    id: banner.id,
  }).then(() => {
    dialogRef.value.close()
  })
}
</script>
