<script setup lang="ts">
import {ref} from 'vue'
const number = ref(0)

</script>

<template>
  <main class="mx-4 min-h-full flex flex-col items-stretch">
    <div class="h-24 flex items-center justify-between" ref="heading">
      <h1 class="text-3xl font-semibold leading-none">Статистика</h1>
    </div>
  </main>
</template>
