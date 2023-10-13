<template>
  <form @submit.prevent="signIn">
    <InputText id="login" :disabled="isLoading" type="text" placeholder="Логин" v-model="login" class="w-full mb-8 text-center" required />
    <InputText id="password" :disabled="isLoading" type="password" placeholder="Пароль" v-model="password" class="w-full mb-8 text-center" required />

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
import ky from '@/network'

const toast = useToast()

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated, accessToken, refreshToken, userID } = storeToRefs(userStore)

const login = ref('')
const password = ref('')

const { isLoading, mutate } = useMutation<any, any, any>({
  mutationFn: (payload: any) => ky.post('api/password_verification', { json: payload, hooks: {
    afterResponse: [
      async (request, options, response) => {
        const body = await response.json()
        if (response.status === 400) {
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

const signIn = () => {
  mutate({
    password: password.value,
    phone: login.value
  })
}
</script>
