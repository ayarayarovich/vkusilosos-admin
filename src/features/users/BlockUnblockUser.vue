<template>
  <div>
    <p class="my-8 text-lg leading-loose">
      Вы уверены, что хотите изменить статус блокировки пользователя
      <span
        class="min-w-max inline-block font-bold px-2 rounded-lg bg-indigo-100 whitespace-nowrap"
      >
        {{ user.name || '*без имени*' }} (id: {{ user.id }})</span
      >
    </p>
    <div class="flex justify-end gap-4">
      <Button label="Нет" severity="secondary" @click="dialogRef.close()" />
      <Button label="Да" severity="danger" @click="deleteUser()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { inject, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { User } from '@/interfaces'

const toast = useToast()
const queryClient = useQueryClient()

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as User

const deleteMutation = reactive(
  useMutation({
    mutationFn: () =>
      axiosPrivate.delete('admin/user', {
        params: {
          id: user.id
        }
      }),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Статус пользователя ${user.name} (id: ${user.id}) изменён`
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

const deleteUser = () => {
  deleteMutation.mutate()
  dialogRef.value.close()
}
</script>
