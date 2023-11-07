<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button
        label="Подарить бонусы"
        :disabled="props.disabled"
        icon="pi pi-external-link"
        severity="success"
        @click="visible = true"
      />
    </div>

    <Dialog
      v-model:visible="visible"
      modal
      :header="`Подарить бонусы ${props.user?.name || '(Имя отсутсвует)'} (id: ${props.user?.id})`"
      class="max-w-xl w-full m-4"
    >
      <form class="p-2" @submit="onSubmit">
        <MyInputNumber name="id" label="ID" :initial-value="props.user?.id" disabled />
        <MyInputNumber name="bonus" label="Количество бонусов" />

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Подарить"
          :loading="updateBonusMutation.isLoading"
          :disabled="updateBonusMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { User } from '@/interfaces'
import MyInputNumber from '@/components/MyInputNumber.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps<{
  disabled?: boolean
  user?: User
}>()

const toast = useToast()
const queryClient = useQueryClient()

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID пользователя'),
    bonus: yup.number().required().label('Количество бонусов')
  })
})

const visible = ref(false)

const updateBonusMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => axiosPrivate.post('admin/user/gift', payload),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Добавлено бонусов ${props.user?.name} (id: ${props.user?.id})`
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
})
</script>
