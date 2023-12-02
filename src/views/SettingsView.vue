<template>
  <main class="px-4 h-screen flex flex-col items-stretch">
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Настройки</h1>
    <CommonSettingsForm />
    <DocumentsForm />
  </main>
</template>

<script setup lang="ts">
import { CommonSettingsForm, DocumentsForm } from '@/features/settings'
</script>
