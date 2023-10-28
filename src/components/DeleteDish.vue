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
import type { UpdateDish } from '@/interfaces'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, reactive, watch, computed } from 'vue'
import { axiosPrivate } from '@/network'
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
      axiosPrivate
        .delete('admin/dish', {
          params: {
            id: tableSelectionStore.id!
          }
        }),
    onSuccess() {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Удалено блюдо ${tableSelectionStore.name} (id: ${tableSelectionStore.id})`
      })
      queryClient.invalidateQueries(['dishes'])
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось удалить блюдо'
      })
    }
  })
)

const confirmDelete = () => {
    confirm.require({
        message: 'Вы уверены, что хотите удалить это блюдо?',
        header: 'Подтверждение',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            deleteDishMutation.mutate()
        },
        reject: () => {}
    });
};


</script>