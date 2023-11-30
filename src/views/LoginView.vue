<script setup lang="ts">
import logoSrc from '@/assets/logo.svg'

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

import { useMutation } from '@tanstack/vue-query'
import { axiosPublic } from '@/network'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MyInputText from '@/components/MyInputText.vue'

const toast = useToast()

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated, accessToken, refreshToken, userID } = storeToRefs(userStore)

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    login: yup.string().required().label('Логин'),
    password: yup.string().required().label('Пароль')
  })
})

const { isLoading, mutate } = useMutation<any, any, any>({
  mutationFn: async (payload: any) => {
    return axiosPublic.post('auth/login', payload)
  },
  onSuccess({ data }) {
    accessToken.value = data.token
    refreshToken.value = data.refreshToken
    isAuthenticated.value = true
    router.push({ name: 'dashboard' })
  },
  onError(error: any) {
    const body = error.response.data

    if (error.response.status === 401) {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Ошибка',
        detail: 'Неверный логин или пароль'
      })
    }
    else {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Ошибка',
        detail: body
      })
    }
  }
})

const signIn = handleSubmit((vals) => {
  mutate(vals)
})
</script>

<template>
  <main class="p-4 min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center">
      <div class="w-full text-center mb-4 flex justify-center flex-col">
        <img :src="logoSrc" alt="Image" class="mb-12 h-12" />
        <div class="text-900 text-3xl font-medium mb-3">
          Вход <br />
          в панель администратора
        </div>
      </div>

      <form class="w-full max-w-sm" @submit="signIn">
        <MyInputText label="Логин" type="text" name="login" />
        <MyInputText label="Пароль" type="password" name="password" />

        <Button
          icon="pi pi-user"
          class="w-full flex items-center mt-4 p-4"
          label="Войти"
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </form>
    </div>
  </main>
</template>
