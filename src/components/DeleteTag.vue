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
import type { Tag } from '@/interfaces'

const props = defineProps<{
  disabled?: boolean
  tag?: Tag
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const deleteMutation = reactive(
  useMutation({
    mutationFn: () => Promise.reject('Tag deletion route not implemented.'),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удален ресторан ${props.tag?.name} (id: ${props.tag?.id})`
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

const confirmDelete = () => {
  confirm.require({
    message: `Вы уверены, что хотите удалить этот тег ${props.tag?.name} (id: ${props.tag?.id}) ?`,
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
