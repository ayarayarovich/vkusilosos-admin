<script setup lang="ts">
import { reactive } from 'vue'
import logoSrc from '@/assets/logo.svg'

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

import { useMutation } from '@tanstack/vue-query'
import { axiosPublic } from '@/network'

const toast = useToast()

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated, accessToken, refreshToken, userID } = storeToRefs(userStore)

const form = reactive({
  password: '',
  phone: ''
})

const { isLoading, mutate } = useMutation<any, any, any>({
  mutationFn: async (payload: any) => {
    return axiosPublic.post('api/password_verification', payload)
  },
  onSuccess({ data }) {
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    userID.value = data.user.userId
    isAuthenticated.value = true
    router.push({ name: 'dashboard' })
  },
  onError(error: any) {
    const body = error.response.data
    toast.add({
      severity: 'error',
      life: 3000,
      summary: body.message,
      detail: error
    })
  }
})

const signIn = () => {
  mutate(form)
}
</script>

<template>
  <main class="p-4 min-h-screen flex items-center justify-center">
    <div class="min-w-fit">
      <div class="text-center mb-4 flex justify-center flex-col">
        <img :src="logoSrc" alt="Image" class="mb-12 h-12" />
        <div class="text-900 text-3xl font-medium mb-3">
          Вход <br />
          в панель администратора
        </div>
      </div>

      <div>
        <form @submit.prevent="signIn">
          <InputText
            id="login"
            :disabled="isLoading"
            type="text"
            placeholder="Логин"
            v-model="form.phone"
            class="w-full mb-8 text-center"
            required
          />
          <InputText
            id="password"
            :disabled="isLoading"
            type="password"
            placeholder="Пароль"
            v-model="form.password"
            class="w-full mb-8 text-center"
            required
          />

          <Button
            icon="pi pi-user"
            class="w-full flex items-center p-4"
            label="Войти"
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </form>
      </div>
    </div>
  </main>
</template>
