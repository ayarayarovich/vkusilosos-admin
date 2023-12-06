<script setup lang="ts">
function getGradient(ctx: any, chartArea: any) {
  let gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
  gradient.addColorStop(1, 'rgba(0, 147, 233, 0.5)')
  gradient.addColorStop(0, 'rgba(128, 208, 199, 0.2)')
  return gradient
}
</script>

<template>
  <main class="flex flex-col items-stretch px-4">
    <h1 class="my-12 text-center text-3xl font-semibold leading-none text-black">Дашборд</h1>
    <div class="mb-8 flex items-stretch gap-4">
      <div class="flex-1 rounded-lg border bg-white p-8">
        <div class="mb-4 flex items-start justify-between text-black">
          <div>
            <div class="mb-2 font-medium">Заказы</div>
            <div class="text-lg font-bold">152</div>
          </div>
          <div class="flex aspect-square h-10 items-center justify-center rounded-lg bg-orange-100">
            <i class="pi pi-fw pi-shopping-cart" />
          </div>
        </div>
        <div class="text-sm">
          <span class="font-medium text-green-500">24 новых заказа</span> с последнего посещения
        </div>
      </div>

      <div class="flex-1 rounded-lg border bg-white p-8">
        <div class="mb-4 flex items-start justify-between text-black">
          <div>
            <div class="mb-2 font-medium">Доход</div>
            <div class="text-lg font-bold">56 000 ₽</div>
          </div>
          <div class="flex aspect-square h-10 items-center justify-center rounded-lg bg-green-100">
            <i class="pi pi-fw pi-money-bill" />
          </div>
        </div>
        <div class="text-sm">
          <span class="font-medium text-green-500">+25%</span> с прошлой недели
        </div>
      </div>

      <div class="flex-1 rounded-lg border bg-white p-8">
        <div class="mb-4 flex items-start justify-between text-black">
          <div>
            <div class="mb-2 font-medium">Клиенты</div>
            <div class="text-lg font-bold">24314</div>
          </div>
          <div class="flex aspect-square h-10 items-center justify-center rounded-lg bg-red-100">
            <i class="pi pi-fw pi-user" />
          </div>
        </div>
        <div class="text-sm">
          <span class="font-medium text-green-500">520</span> новых клиентов
        </div>
      </div>

      <div class="flex-1 rounded-lg border bg-white p-8">
        <div class="mb-4 flex items-start justify-between text-black">
          <div>
            <div class="mb-2 font-medium">Отзывы</div>
            <div class="text-lg font-bold">143 новых</div>
          </div>
          <div class="flex aspect-square h-10 items-center justify-center rounded-lg bg-purple-100">
            <i class="pi pi-fw pi-comments" />
          </div>
        </div>
        <div class="text-sm"><span class="font-medium text-green-500">46</span> отвеченных</div>
      </div>
    </div>

    <div class="mb-8 flex gap-4">
      <Chart
        class="w-full"
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
