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

    <Dialog v-model:visible="visible" modal :header="`Подарить бонусы ${tableSelectionStore.name} (id: ${tableSelectionStore.id})`" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <div class="w-full">
            <label for="bonus" class="block text-900 font-medium mb-2">Количество бонусов</label>
            <InputNumber id="bonus" v-model="bonus" class="w-full" required />
        </div>

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Подарить"
          :loading="updateDishMutation.isLoading"
          :disabled="updateDishMutation.isLoading"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive } from 'vue'
import ky from '@/network'
import { useToast } from 'primevue/usetoast'
import { useTableSelectionStore } from '@/stores/table-selection-store'

const props = defineProps<{
  disabled?: boolean
}>()

const toast = useToast()
const queryClient = useQueryClient()

const bonus = ref<number>()

const visible = ref(false)

const tableSelectionStore = useTableSelectionStore()

const updateDishMutation = reactive(
  useMutation({
    mutationFn: (payload: any) => ky.post('admin/user/gift', { json: payload }).json(),
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Добавлено бонусов ${tableSelectionStore.name} (id: ${tableSelectionStore.id})`
      })
      queryClient.invalidateQueries(['users'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось добавить бонусов'
      })
    }
  })
)

const onSubmit = (e: Event) => {
  updateDishMutation.mutate({
    id: tableSelectionStore.id,
    bonus: bonus.value
  })
}
</script>