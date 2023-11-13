<template>
  <form class="mt-8" @submit="onSubmit">
    <MyInputNumber name="id" label="ID" :initial-value="user.id" disabled />
    <MyInputNumber name="bonus" label="Количество бонусов" />

    <Button
      class="w-full flex items-center p-4 mt-8"
      type="submit"
      label="Подарить"
      :loading="updateBonusMutation.isLoading"
      :disabled="updateBonusMutation.isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { reactive, inject } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { User } from '@/interfaces'
import MyInputNumber from '@/components/MyInputNumber.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const toast = useToast()
const queryClient = useQueryClient()

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as User

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID пользователя'),
    bonus: yup.number().required().label('Количество бонусов')
  })
})

const updateBonusMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => axiosPrivate.post('admin/user/gift', payload),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Добавлено бонусов ${user.name} (id: ${user.id})`
      })
      queryClient.invalidateQueries(['users'])
    },
    onError(error: any) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось добавить бонусов',
        detail: error
      })
    }
  })
)

const onSubmit = handleSubmit((vals) => {
  updateBonusMutation.mutate(vals)
  dialogRef.value.close()
})
</script>
