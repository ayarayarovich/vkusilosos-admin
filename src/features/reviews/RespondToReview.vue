<template>
  <form @submit.prevent="onSubmit">
    <div class="flex gap-4">
      <MyInputNumber name="id" label="ID" disabled />
      <MyInputNumber name="user_id" label="ID пользователя" disabled />
    </div>

    <div class="mb-4 rounded-lg bg-indigo-50 p-4 text-gray-900">
      <p>{{ review.text }}</p>
    </div>

    <DropdownSelect
      name="status"
      label="Статус"
      placeholder="Выберите"
      :options="[
        {
          label: 'Не отвечен',
          code: 0
        },
        {
          label: 'Отвечен',
          code: 1
        }
      ]"
    >
      <template #value="slotProps">
        <template v-if="slotProps.value">
          <Tag
            v-if="slotProps.value.code === 0"
            icon="pi pi-times"
            :value="slotProps.value.label"
            severity="danger"
          />
          <Tag
            v-else-if="slotProps.value.code === 1"
            icon="pi pi-check-circle"
            :value="slotProps.value.label"
            severity="success"
          />
        </template>
      </template>
      <template #option="slotProps">
        <Tag
          v-if="slotProps.option.code === 0"
          icon="pi pi-times"
          :value="slotProps.option.label"
          severity="danger"
        />
        <Tag
          v-else-if="slotProps.option.code === 1"
          icon="pi pi-check-circle"
          :value="slotProps.option.label"
          severity="success"
        />
      </template>
    </DropdownSelect>

    <Button
      class="mt-4 flex w-full items-center"
      type="submit"
      label="Сохранить"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import MyInputNumber from '@/components/MyInputNumber.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { inject } from 'vue'
import { useChangeReviewStatus } from './composables'
import { type IReview } from './interfaces'

const dialogRef = inject('dialogRef') as any
const review = dialogRef.value.data.review as IReview

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    id: yup.number().required().label('ID отзыва'),
    user_id: yup.number().required().label('ID пользователя'),
    status: yup.number().required().label('Статус')
  }),
  initialValues: review
})

const { mutate, isLoading } = useChangeReviewStatus()

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
