<template>
  <div>
    <label :for="inputID" class="block text-900 font-medium mb-2">{{ props.label }}</label>
    <MultiSelect
      class="w-full"
      :class="{ 'p-invalid': errorMessage }"
      v-model="selected"
      :input-id="inputID"
      :options="props.options"
      optionLabel="label"
      :placeholder="props.placeholder"
      @blur="handleBlur"
      @change="handleChange"
    >
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps"></slot>
      </template>

      <template #value="slotProps">
        <slot name="value" v-bind="slotProps"></slot>
      </template>
    </MultiSelect>
    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  options: { code: string | number; label: string | number }[]
  placeholder?: string
  name: string
  label: string
}>()

const inputID = computed(() => `multiselect-${props.name}`)
const selected = ref<typeof props.options>()

const { setValue, errorMessage, handleBlur, handleChange, value } = useField(() => props.name)

const initial = ref(true)

watch([selected], () => {
  if (selected.value) {
    setValue(selected.value.map((v) => v.code))
  }
})
watch([value], () => {
  if (initial.value) {
    selected.value = props.options.filter((opt) => opt.code === value.value)
    initial.value = false
  }
})
</script>
