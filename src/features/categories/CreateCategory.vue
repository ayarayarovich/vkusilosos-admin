<template>
  <form class="w-full" @submit.prevent="onSubmit">
    <div>
      <MyInputText name="name" label="Название" />

      <div class="flex gap-4">
        <DropdownSelect
          class="flex-1"
          name="active"
          label="Активно"
          :options="[
            {
              label: 'Не активна',
              code: false
            },
            {
              label: 'Активна',
              code: true
            }
          ]"
        >
          <template #value="slotProps">
            <Tag
              v-if="slotProps.value.code === false"
              icon="pi pi-ban"
              :value="slotProps.value.label"
              severity="danger"
            />
            <Tag
              v-else-if="slotProps.value.code === true"
              icon="pi pi-check-circle"
              :value="slotProps.value.label"
              severity="success"
            />
          </template>
          <template #option="slotProps">
            <Tag
              v-if="slotProps.option.code === false"
              icon="pi pi-ban"
              :value="slotProps.option.label"
              severity="danger"
            />
            <Tag
              v-else-if="slotProps.option.code === true"
              icon="pi pi-check-circle"
              :value="slotProps.option.label"
              severity="success"
            />
          </template>
        </DropdownSelect>

        <DropdownSelect
          class="flex-1"
          name="addable"
          label="Тип"
          :options="[
            {
              label: 'Обычная',
              code: false
            },
            {
              label: 'Добавки',
              code: true
            }
          ]"
        >
          <template #value="slotProps">
            <template v-if="slotProps.value">
              <Tag
                v-if="slotProps.value.code === false"
                :value="slotProps.value.label"
                severity="warning"
              />
              <Tag
                v-else-if="slotProps.value.code === true"
                :value="slotProps.value.label"
                severity="primary"
              />
            </template>
          </template>
          <template #option="slotProps">
            <Tag
              v-if="slotProps.option.code === false"
              :value="slotProps.option.label"
              severity="warning"
            />
            <Tag
              v-else-if="slotProps.option.code === true"
              :value="slotProps.option.label"
              severity="primary"
            />
          </template>
        </DropdownSelect>
      </div>
    </div>
    <Button
      class="mt-4 flex w-full items-center"
      type="submit"
      label="Создать"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import MyInputText from '@/components/MyInputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useCreateCategory } from './composables'
import DropdownSelect from '@/components/DropdownSelect.vue'

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required().label('Название'),
    active: yup.boolean().required().label('Активна'),
    addable: yup.boolean().required().label('Тип категории')
  }),
  initialValues: {
    active: false,
    addable: false
  }
})

const { mutate, isLoading } = useCreateCategory()

const onSubmit = handleSubmit((vals) => {
  mutate(vals)
})
</script>
