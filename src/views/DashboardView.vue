<script setup lang="ts">
</script>

<template>
  <main class="mx-4 min-h-screen flex flex-col items-stretch">
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Дашборд</h1>
    <div class="flex items-stretch gap-4">

      <div class="flex-1 bg-white rounded-lg p-8 border">
        <div class="flex items-start justify-between text-black mb-4">
          <div>
            <div class="font-medium mb-2">Заказы</div>
            <div class="text-lg font-bold">152</div>
          </div>
          <div class="h-10 rounded-lg aspect-square bg-orange-100 flex items-center justify-center">
            <i class="pi pi-fw pi-shopping-cart" />
          </div>
        </div>
        <div class="text-sm">
          <span class="text-green-500 font-medium">24 новых заказа</span> с последнего посещения
        </div>
      </div>

      <div class="flex-1 bg-white rounded-lg p-8 border">
        <div class="flex items-start justify-between text-black mb-4">
          <div>
            <div class="font-medium mb-2">Доход</div>
            <div class="text-lg font-bold">56 000 ₽</div>
          </div>
          <div class="h-10 rounded-lg aspect-square bg-green-100 flex items-center justify-center">
            <i class="pi pi-fw pi-money-bill" />
          </div>
        </div>
        <div class="text-sm">
          <span class="text-green-500 font-medium">+25%</span> с прошлой недели
        </div>
      </div>

      <div class="flex-1 bg-white rounded-lg p-8 border">
        <div class="flex items-start justify-between text-black mb-4">
          <div>
            <div class="font-medium mb-2">Клиенты</div>
            <div class="text-lg font-bold">24314</div>
          </div>
          <div class="h-10 rounded-lg aspect-square bg-red-100 flex items-center justify-center">
            <i class="pi pi-fw pi-user" />
          </div>
        </div>
        <div class="text-sm">
          <span class="text-green-500 font-medium">520</span> новых клиентов
        </div>
      </div>

      <div class="flex-1 bg-white rounded-lg p-8 border">
        <div class="flex items-start justify-between text-black mb-4">
          <div>
            <div class="font-medium mb-2">Отзывы</div>
            <div class="text-lg font-bold">143 новых</div>
          </div>
          <div class="h-10 rounded-lg aspect-square bg-purple-100 flex items-center justify-center">
            <i class="pi pi-fw pi-comments" />
          </div>
        </div>
        <div class="text-sm">
          <span class="text-green-500 font-medium">46</span> отвеченных
        </div>
      </div>

    </div>
  </main>
</template>
