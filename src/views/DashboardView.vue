<script setup lang="ts">
function getGradient(ctx: any, chartArea: any) {
  let gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
  gradient.addColorStop(1, 'rgba(0, 147, 233, 0.5)')
  gradient.addColorStop(0, 'rgba(128, 208, 199, 0.2)')
  return gradient
}
</script>

<template>
  <main class="px-4 h-screen overflow-y-auto flex flex-col items-stretch">
    <h1 class="text-3xl text-center font-semibold leading-none text-black my-12">Дашборд</h1>
    <div class="flex items-stretch gap-4 mb-8">
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
        <div class="text-sm"><span class="text-green-500 font-medium">46</span> отвеченных</div>
      </div>
    </div>

    <div class="flex gap-4 mb-8">
      <Chart
        class="flex-1"
        type="line"
        :options="{
          aspectRatio: 3 / 1
        }"
        :data="{
          labels: [
            '01.08',
            '02.08',
            '03.08',
            '04.08',
            '05.08',
            '06.08',
            '07.08',
            '08.08',
            '09.08',
            '10.08',
            '11.08',
            '12.08',
            '13.08',
            '14.08',
            '15.08',
            '16.08',
            '17.08',
            '18.08',
            '19.08',
            '20.08',
            '21.08',
            '22.08',
            '23.08',
            '24.08',
            '25.08',
            '26.08',
            '27.08',
            '28.08',
            '29.08',
            '30.08',
            '31.08'
          ],
          datasets: [
            {
              label: 'Количество заказов',
              borderColor: 'rgba(0, 147, 233, 1)',
              yAxisID: 'y',
              tension: 0,
              data: [
                67, 81, 86, 95, 96, 99, 82, 78, 84, 78, 87, 88, 102, 103, 77, 81, 99, 103, 100, 88,
                96, 69, 77, 102, 86, 76, 96, 84, 94, 78, 102
              ],
              fill: true,
              backgroundColor: function (context: any) {
                const chart = context.chart
                const { ctx, chartArea } = chart

                // This case happens on initial chart load
                if (!chartArea) return
                return getGradient(ctx, chartArea)
              }
            }
          ]
        }"
      />
    </div>
  </main>
</template>
