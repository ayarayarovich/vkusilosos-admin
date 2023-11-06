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
import type { Restaurant } from '@/interfaces'

const props = defineProps<{
  disabled?: boolean
  restaurant?: Restaurant
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const deleteMutation = reactive(
  useMutation({
    mutationFn: () =>
      axiosPrivate.delete('admin/rest', {
        params: { id: props.restaurant?.id }
      }),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удален ресторан ${props.restaurant?.name} (id: ${props.restaurant?.id})`
      })
      queryClient.invalidateQueries(['rests'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось удалить ресторан'
      })
    }
  })
)

const confirmDelete = () => {
  confirm.require({
    message: `Вы уверены, что хотите удалить этот ресторан ${props.restaurant?.name} (id: ${props.restaurant?.id}) ?`,
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
