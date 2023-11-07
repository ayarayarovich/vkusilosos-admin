<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button
        label="Удалить блюдо"
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
import type { Dish } from '@/interfaces'

const props = defineProps<{
  disabled?: boolean
  dish?: Dish
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const deleteMutation = reactive(
  useMutation({
    mutationFn: () => axiosPrivate.delete('admin/dish', {
      params: {
        id: props.dish?.id
      }
    }),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удалено блюдо ${props.dish?.name} (id: ${props.dish?.id})`
      })
      queryClient.invalidateQueries(['dishes'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось удалить блюдо',
        detail: error
      })
    }
  })
)

const confirmDelete = () => {
  confirm.require({
    message: `Вы уверены, что хотите удалить категорию ${props.dish?.name} (id: ${props.dish?.id}) ?`,
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
