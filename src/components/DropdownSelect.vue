<template>
  <div>
    <label :for="inputID" class="block text-900 font-medium mb-2">{{ props.label }}</label>
    <Dropdown
      class="w-full"
      :class="{ 'p-invalid': errorMessage }"
      v-model="selected"
      :input-id="inputID"
      :options="props.options"
      optionLabel="label"
      :placeholder="props.placeholder"
      @blur="handleBlur"
      @change="handleChange"
    />
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

const inputID = computed(() => `select-${props.name}`)
const selected = ref<(typeof props.options)[0]>()

const { setValue, errorMessage, handleBlur, handleChange, value } = useField(() => props.name)

watch([selected], () => {
  setValue(selected.value?.code)
})
watch([value], () => {
  console.log('value changed: ', value)
  selected.value = props.options.find((opt) => opt.code === value.value)
})
</script>
