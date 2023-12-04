<template>
  <main class="px-4 mb-12">
    <h1 class="py-12 text-center text-3xl font-semibold leading-none text-black">Настройки</h1>
    <div class="flex flex-col items-stretch gap-24">
      <CommonSettingsForm />
      <BroadcastNotification />
      <DocumentsForm />
    </div>
  </main>
</template>

<script setup lang="ts">
import { CommonSettingsForm, DocumentsForm, BroadcastNotification } from '@/features/settings'
</script>
