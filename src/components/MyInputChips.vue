<template>
    <div class="w-full">
        <label :for="inputID" class="text-900 mb-2 block font-medium">{{ props.label }}</label>
        <Chips
            :id="inputID"
            v-model="value"
            :name="props.name"
            :label="props.label"
            :type="props.type || 'text'"
            class="w-full"
            :pt="{
                container: {
                    class: 'w-full'
                }
            }"
            :class="{
                'p-invalid': errorMessage
            }"
            @blur="handleBlur"
            @change="handleChange"
        />

        <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
    </div>
</template>

<script setup lang="ts">
import Chips from 'primevue/chips'
import { useField } from 'vee-validate'
import { computed } from 'vue'

const props = defineProps<{
    label: string
    name: string
    type?: string
    initialValue?: string
}>()

const { errorMessage, handleBlur, handleChange, value } = useField<any>(
    () => props.name,
    {},
    {
        initialValue: props.initialValue
    }
)

const inputID = computed(() => `input-chips-${props.name}`)
</script>
