<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button
        label="Удалить"
        :disabled="disabled"
        icon="pi pi-times"
        severity="danger"
        @click="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { Category } from '@/interfaces'

const props = defineProps<{
  disabled?: boolean
  category?: Category
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const deleteMutation = reactive(
  useMutation({
    mutationFn: () => Promise.reject('Category deletion route not implemented.'),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удалена категория ${props.category?.name} (id: ${props.category?.id})`
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

const confirmDelete = () => {
  confirm.require({
    message: `Вы уверены, что хотите удалить категорию ${props.category?.name} (id: ${props.category?.id}) ?`,
    header: 'Подтверждение',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteMutation.mutate()
    },
    reject: () => {}
  })
}
</script>
