<template>
  <div class="w-full">
    <label :for="inputID" class="block text-900 font-medium mb-2">{{ props.label }}</label>
    <InputNumber
      :id="inputID"
      v-model="value"
      :name="props.name"
      :label="props.label"
      class="w-full"
      size="small"
      :class="{
        'p-invalid': errorMessage
      }"
      :mode="props.mode"
      :currency="props.currency"
      :disabled="props.disabled"
    />

    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, onMounted, toRefs, watch } from 'vue'

const props = defineProps<{
  label: string
  name: string
  mode?: 'currency' | 'decimal'
  currency?: string
  initialValue?: number
  disabled?: boolean
}>()

const { errorMessage, value } = useField<any>(
  () => props.name,
  {},
  {
    initialValue: props.initialValue
  }
)

const inputID = computed(() => `input-number-${props.name}`)
</script>
