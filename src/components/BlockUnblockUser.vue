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
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { User } from '@/interfaces'

const props = defineProps<{
  disabled?: boolean
  user?: User
}>()

const toast = useToast()
const confirm = useConfirm()
const queryClient = useQueryClient()

const deleteDishMutation = reactive(
  useMutation({
    mutationFn: () =>
      axiosPrivate.delete('admin/user', {
        params: {
          id: props.user?.id
        }
      }),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Статус пользователя ${props.user?.name} (id: ${props.user?.id}) изменён`
      })
      queryClient.invalidateQueries(['users'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось изменить статус пользователя',
        detail: error
      })
    }
  })
)

const confirmStatusChange = () => {
  confirm.require({
    message: `Вы уверены, что хотите изменить статус пользователя ${props.user?.name} (id: ${props.user?.id}) ?`,
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
