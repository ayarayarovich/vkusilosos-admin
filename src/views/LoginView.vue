<script setup lang="ts">
import { ref } from 'vue'
import logoSrc from '@/assets/logo.svg'

import LoginForm from '@/components/LoginForm.vue'

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
        <LoginForm/>
      </div>
    </div>
  </main>
</template>
