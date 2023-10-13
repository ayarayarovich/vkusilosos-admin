import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTableSelectionStore = defineStore(
  'table-selection-store',
  () => {
    const id = ref<number>()
    const name = ref<string>()

    return { id, name }
  }
)
