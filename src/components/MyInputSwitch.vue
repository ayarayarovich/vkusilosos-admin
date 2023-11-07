<template>
  <div class="w-full">
    <div class="flex items-center gap-4">
      <InputSwitch
        :id="inputID"
        v-model="inputValue"
        :name="props.name"
        :label="props.label"
        :class="{
          'p-invalid': errorMessage
        }"
      />
      <label :for="inputID" class="block text-900 font-medium">{{ props.label }}</label>
    </div>

    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  label: string
  name: string
}>()

const { setValue, errorMessage } = useField(() => props.name)

const inputValue = ref<boolean>()
watch(
  [inputValue],
  () => {
    setValue(inputValue.value)
  },
  {
    immediate: true
  }
)

const inputID = computed(() => `input-number-${props.name}`)
</script>
