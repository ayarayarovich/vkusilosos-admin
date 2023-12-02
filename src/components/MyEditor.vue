<template>
  <div class="w-full">
    <label :for="inputID" class="block text-900 font-medium mb-2">{{ props.label }}</label>
    <Editor :id="inputID" v-model="value" editor-style="height: 10rem" />

    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed } from 'vue'
import Editor from 'primevue/editor'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  label: string
  name: string
  type?: string
  initialValue?: string
}>()

const { errorMessage, value } = useField<any>(
  () => props.name,
  {},
  {
    initialValue: props.initialValue
  }
)

const inputID = computed(() => `${uuidv4()}-input-text-${props.name}`)
</script>
