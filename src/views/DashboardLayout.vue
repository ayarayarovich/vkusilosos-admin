<template>
  <Splitter class="min-h-screen border-0">
    <SplitterPanel :size="20" class="px-4 flex flex-col items-stretch">
        <img :src="logoSrc" class="h-8 w-full object-contain object-center my-6" alt="" />
        <ul class="flex flex-col gap-1 grow">
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'users'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Пользователи</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'feedback'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Отзывы</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'dishes'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Блюда</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'stats'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Статистика</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'categories'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Категории</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'tags'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Теги</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'stories'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Истории</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'banners'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Баннеры</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'promotions'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Акции</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'restaurants'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Рестораны</span></RouterLink></li>
          <li><RouterLink v-slot="{isActive}" class="w-full rounded-lg" :to="{name: 'orders'}"><span class="px-6 py-2 hover:bg-gray-100 block rounded-lg transition-all" :class="isActive ? 'bg-gray-200 font-medium' : ''">Заказы</span></RouterLink></li>
          <li class="grow flex flex-col justify-end mb-4"><button @click="userStore.signOut" class="px-6 py-3 hover:bg-gray-100 block rounded-lg transition-all text-start">Выйти</button></li>
        </ul>
    </SplitterPanel>
    <SplitterPanel :size="80" class="">
      <RouterView />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import logoSrc from '@/assets/logo.svg'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

</script>
