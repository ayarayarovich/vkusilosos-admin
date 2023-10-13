<template>
  <form @submit.prevent="login">
    <label for="phone" class="block text-900 font-medium mb-2">Логин</label>
    <InputText
      id="phone"
      v-model="payload.phone"
      type="text"
      class="w-full mb-8"
      :disabled="isLoading"
      required
    />
    <Button
      icon="pi pi-user"
      class="w-full flex items-center p-4"
      type="submit"
      label="Отправить код"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { baseURL } from '@/network'
import ky from '@/network'

const emit = defineEmits<{
  (e: 'setPhone', value: string): void
}>()

const payload = reactive({ phone: '' })

const { isLoading, mutate } = useMutation({
  mutationKey: ['send-sms'],
  mutationFn: (payload: any) => ky.post('api/login', { json: payload }).json(),
  onSuccess(data, variables, context) {
    emit('setPhone', payload.phone)
  }
})

// const { isLoading, mutate } = useMutation({
//   mutationKey: ['send-sms'],
//   mutationFn: (payload: any) => fetch(baseURL + '/api/login', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'accept': 'application/json'
//     },
//     body: JSON.stringify(payload)
//   }).then(res => res.json()),
//   onSuccess(data, variables, context) {
//     emit('setPhone', payload.phone)
//   }
// })

const login = () => {
  mutate(payload)
}
</script>
