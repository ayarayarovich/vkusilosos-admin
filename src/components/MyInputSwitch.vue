<template>
  <div>
    <div class="flex items-center gap-4">
      <InputSwitch
        :id="inputID"
        v-model="value"
        :name="props.name"
        :label="props.label"
        :class="{
          'p-invalid': errorMessage
        }"
      />
      <label :for="inputID" @click="setValue(!value)" class="block text-900 font-medium">{{ props.label }}</label>
    </div>

    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  label: string
  name: string
  initialValue?: boolean
}>()

const { initialValue } = toRefs(props)

const { errorMessage, value, setValue } = useField<boolean>(
  () => props.name,
  {},
  {
    initialValue
  }
)

const inputID = computed(() => `input-number-${props.name}`)
</script>
