<template>
  <form @submit.prevent="login">
    <label for="password" class="block text-900 font-medium mb-2">Введите СМС-код</label>
    <InputText id="password" :disabled="isLoading" v-model="code" class="w-full mb-8 text-center" required />
    <Button
      icon="pi pi-user"
      class="w-full flex items-center p-4"
      label="Войти"
      type="submit"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

import { useMutation } from '@tanstack/vue-query'
import ky, { baseURL } from '@/network'

const toast = useToast()

const props = defineProps<{
  phone: string
}>()

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated, accessToken, refreshToken, userID } = storeToRefs(userStore)

const code = ref('')

const { isLoading, mutate } = useMutation<{
  accessToken: string,
  refreshToken: string,
  user: {
    userId: number,
    role: string,
    phone: string
  }
}>({
  mutationFn: (payload: any) => ky.post('api/sms_verification', { json: payload, hooks: {
    afterResponse: [
      async (request, options, response) => {
        const body = await response.json()
        if (response.status === 400 && body.error.type === 'WrongSmsCode') {
          toast.add({
            severity: 'error',
            summary: body.message
          })
        }
      }
    ]
  } }).json(),
  onSuccess(data) {
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    userID.value = data.user.userId
    isAuthenticated.value = true
    router.push({ name: 'dashboard' })
  },
})

const login = () => {
  mutate({
    code: code.value,
    phone: props.phone
  })
}
</script>
