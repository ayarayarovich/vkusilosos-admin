<script setup lang="ts">
import { ref } from 'vue'
const number = ref(0)
</script>

<template>
  <main class="flex min-h-full flex-col items-stretch px-4">
    <div class="flex h-24 items-center justify-between" ref="heading">
      <h1 class="text-3xl font-semibold leading-none text-black">Акции</h1>
    </div>
  </main>
</template>
