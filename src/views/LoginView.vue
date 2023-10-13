<script setup lang="ts">
import { ref } from 'vue'
import logoSrc from '@/assets/logo.svg'

import LoginSendSMS from '@/components/LoginSendSMS.vue'
import LoginVerifySMS from '@/components/LoginVerifySMS.vue'

const phone = ref('')

const stage = ref<'send-sms' | 'verification'>('send-sms')

const setPhone = (val: string) => {
  phone.value = val
  stage.value = 'verification'
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
        <Transition name="fade" mode="out-in">
          <LoginSendSMS @set-phone="setPhone" v-if="stage == 'send-sms'"/>
          <LoginVerifySMS :phone="phone" v-else-if="stage == 'verification'"/>
        </Transition>
      </div>
    </div>
  </main>
</template>
