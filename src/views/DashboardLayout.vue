<template>
  <Splitter class="h-screen border-0">
    <SplitterPanel :size="1" class="px-2">
      <ScrollPanel class="h-full">
        <div class="px-6 py-4 flex flex-col items-stretch text-black">
          <img :src="logoSrc" class="h-8 w-full object-contain object-center my-6" alt="" />
          <ul class="flex flex-col gap-1 grow">
            <li class="font-bold mt-2 text-sm mb-1">Главная</li>
            <li class="min-w-max">
              <RouterLink
                v-slot="{ isExactActive }"
                class="w-full rounded-lg"
                :to="{ name: 'dashboard' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isExactActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-home" /> Дашборд</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink
                v-slot="{ isActive }"
                class="w-full rounded-lg"
                :to="{ name: 'settings' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-cog" /> Настройки</span
                ></RouterLink
              >
            </li>

            <li class="font-bold mt-2 text-sm mb-1">Пользователи</li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'users' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-user" /> Пользователи</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'feedback' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-comments" /> Отзывы</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'orders' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-shopping-cart" /> Заказы</span
                ></RouterLink
              >
            </li>

            <li class="font-bold mt-2 text-sm mb-1">Еда</li>
            <li class="min-w-max">
              <RouterLink
                v-slot="{ isActive }"
                class="w-full rounded-lg"
                :to="{ name: 'categories' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-sitemap" /> Категории</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'dishes' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-book" /> Блюда</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'tags' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-hashtag" /> Теги</span
                ></RouterLink
              >
            </li>

            <li class="font-bold mt-2 text-sm mb-1">Точки</li>
            <li class="min-w-max">
              <RouterLink
                v-slot="{ isActive }"
                class="w-full rounded-lg"
                :to="{ name: 'restaurants' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-building" /> Рестораны</span
                ></RouterLink
              >
            </li>

            <li class="font-bold mt-2 text-sm mb-1">Маркетинг</li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'stories' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-instagram" /> Истории</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink v-slot="{ isActive }" class="w-full rounded-lg" :to="{ name: 'banners' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-images" /> Баннеры</span
                ></RouterLink
              >
            </li>
            <li class="min-w-max">
              <RouterLink
                v-slot="{ isActive }"
                class="w-full rounded-lg"
                :to="{ name: 'promotions' }"
                ><span
                  class="text-sm px-4 py-2 hover:bg-gray-100 block rounded-lg transition-all"
                  :class="isActive ? 'bg-gray-100 font-semibold text-indigo-500' : ''"
                  ><i class="pi pi-fw pi-percentage" /> Акции</span
                ></RouterLink
              >
            </li>
            <li class="grow flex flex-col justify-end mt-8">
              <button
                @click="userStore.signOut"
                class="p-3 hover:bg-gray-100 block rounded-lg transition-all text-start"
              >
                <i class="pi pi-fw pi-sign-out" /> Выйти
              </button>
            </li>
          </ul>
        </div>
      </ScrollPanel>
    </SplitterPanel>
    <SplitterPanel :size="99" class="h-screen overflow-y-auto">
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
