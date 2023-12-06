<template>
  <div class="mt-4 flex flex-col items-stretch gap-4 text-black">
    <div class="flex items-end leading-none">
      <div>ID</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>{{ user.id || 'Нет данных' }}</div>
    </div>

    <div class="flex items-end leading-none">
      <div>Имя</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>{{ user.name || 'Нет данных' }}</div>
    </div>

    <div class="flex items-end leading-none">
      <div>Фамилия</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>{{ user.surname || 'Нет данных' }}</div>
    </div>

    <div class="flex items-end leading-none">
      <div>Телефон</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>{{ user.phone || 'Нет данных' }}</div>
    </div>

    <div class="flex items-end leading-none">
      <div>Бонусы</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>{{ user.bonuses || 'Нет данных' }}</div>
    </div>

    <div class="flex items-end leading-none">
      <div>День рождения</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>{{ user.birthday ? dateFormat(user.birthday, 'dd.mm.yyyy') : 'Нет данных' }}</div>
    </div>

    <div class="flex items-end leading-none">
      <div>Роль</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>
        <template v-if="user.role">
          <Tag v-if="user.role === 'user'" icon="pi pi-user" value="Обычный" severity="info"></Tag>
          <Tag
            v-else-if="user.role === 'admin'"
            icon="pi pi-bolt"
            value="Админ"
            severity="warning"
          ></Tag>
          <Tag v-else :value="user.role" severity="info" />
        </template>
        <span v-else>Нет данных</span>
      </div>
    </div>

    <div class="flex items-end leading-none">
      <div>Статус</div>
      <div class="mx-2 grow border-b-2 border-dotted border-black border-opacity-50"></div>
      <div>
        <template v-if="user.status">
          <Tag v-if="user.status === 0" icon="pi pi-lock" value="Заблокирован" severity="danger" />
          <Tag
            v-else-if="user.status === 1"
            icon="pi pi-check-circle"
            value="Активен"
            severity="success"
          />
          <Tag
            v-else-if="user.status === 2"
            icon="pi pi-clock"
            value="На модерации"
            severity="warning"
          />
          <Tag v-else :value="user.status" severity="info" />
        </template>
        <span v-else>Нет данных</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUser } from './interfaces'
import { inject } from 'vue'
import dateFormat from 'dateformat'

const dialogRef = inject('dialogRef') as any
const user = dialogRef.value.data.user as IUser
</script>
