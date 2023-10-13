<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button
        label="Удалить"
        :disabled="disabled"
        icon="pi pi-user"
        severity="warning"
        @click="confirmStatusChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch, computed } from 'vue'
import ky from '@/network'
import { useToast } from 'primevue/usetoast'
import { useTableSelectionStore } from '@/stores/table-selection-store'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps<{
  disabled?: boolean
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const tableSelectionStore = useTableSelectionStore()

const deleteDishMutation = reactive(
  useMutation({
    mutationFn: () =>
      ky
        .delete('admin/user', {
          searchParams: {
            id: tableSelectionStore.id!
          }
        })
        .json(),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Статус пользователя ${tableSelectionStore.name} (id: ${tableSelectionStore.id}) изменён`
      })
      queryClient.invalidateQueries(['users'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить статус пользователя'
      })
    }
  })
)

const confirmStatusChange = () => {
  confirm.require({
    message: `Вы уверены, что хотите изменить статус пользователя ${tableSelectionStore.name} (id: ${tableSelectionStore.id}) ?`,
    header: 'Подтверждение',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteDishMutation.mutate()
    },
    reject: () => {}
  })
}
</script>
