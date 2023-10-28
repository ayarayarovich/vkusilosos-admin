<template>
  <div>
    <div class="flex justify-end gap-4">
      <Button label="Создать блюдо" icon="pi pi-external-link" @click="visible = true" />
    </div>

    <Dialog v-model:visible="visible" modal header="Создать блюдо" class="max-w-4xl w-full m-4">
      <form class="p-2" @submit.prevent="onSubmit">
        <div class="grid grid-cols-3 items-center justify-items-center gap-4">
          <div class="w-full">
            <label for="name" class="block text-900 font-medium mb-2">Название</label>
            <InputText id="name" v-model="form.name" type="text" class="w-full" required />
          </div>

          <div class="w-full">
            <label for="price" class="block text-900 font-medium mb-2">Цена</label>
            <InputNumber
              id="price"
              v-model="form.price"
              type="text"
              class="w-full"
              mode="currency"
              :min="0"
              currency="RUB"
              required
            />
          </div>

          <div class="w-full">
            <label for="sale_price" class="block text-900 font-medium mb-2">Цена продажи</label>
            <InputNumber
              id="sale_price"
              v-model="form.sale_price"
              type="text"
              class="w-full"
              mode="currency"
              :min="0"
              currency="RUB"
              required
            />
          </div>

          <div class="w-full">
            <label for="iiko_id" class="block text-900 font-medium mb-2">IIKO_ID</label>
            <InputNumber
              id="iiko_id"
              v-model="form.iiko_id"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="weight" class="block text-900 font-medium mb-2">Вес</label>
            <InputNumber
              id="weight"
              v-model="form.weight"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="energy" class="block text-900 font-medium mb-2">Пищевая ценность</label>
            <InputNumber
              id="energy"
              v-model="form.energy"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="belki" class="block text-900 font-medium mb-2">Белки</label>
            <InputNumber
              id="belki"
              v-model="form.belki"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="ziri" class="block text-900 font-medium mb-2">Жири</label>
            <InputNumber
              id="ziri"
              v-model="form.ziri"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="uglevodi" class="block text-900 font-medium mb-2">Углеводы</label>
            <InputNumber
              id="uglevodi"
              v-model="form.uglevodi"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="size" class="block text-900 font-medium mb-2">Количество</label>
            <InputNumber
              id="size"
              v-model="form.size"
              type="text"
              class="w-full"
              :min="0"
              required
            />
          </div>

          <div class="w-full">
            <label for="color" class="block text-900 font-medium mb-2">Цвет карточки</label>
            <Dropdown
              class="w-full"
              v-model="selectedCardColor"
              input-id="color"
              :options="possibleCardColors"
              optionLabel="label"
              placeholder="Цвет"
            />
          </div>

          <div class="w-full">
            <label for="category" class="block text-900 font-medium mb-2">Категория</label>
            <Dropdown
              class="w-full"
              v-model="selectedCategory"
              input-id="category"
              :options="possibleCategories"
              optionLabel="label"
              placeholder="Категория"
            />
          </div>

          <div
            class="col-start-1 col-span-1 row-start-1 row-span-3 w-full border-2 border-gray-200 p-2 rounded-lg h-full flex flex-col items-center gap-2"
          >
            <Transition name="fade" mode="out-in">
              <img
                v-if="isImageSelected"
                class="rounded-md w-full h-full aspect-square object-contain object-center drop-shadow-md"
                :src="imageURL"
                alt=""
              />
              <div v-else class="w-full aspect-square flex items-center justify-center">
                Выберите картинку
              </div>
            </Transition>

            <FileUpload
              name="image"
              :auto="true"
              mode="basic"
              customUpload
              @uploader="fileUploader"
              @select="onSelect"
              accept="image/*"
              :maxFileSize="10000000"
            >
              <template #empty>
                <p>Перетащите сюда картинку, которую хотите загрузить</p>
              </template>
            </FileUpload>
          </div>
        </div>

        <div class="grid grid-cols-3 items-center justify-items-center my-8">
          <div class="flex items-center gap-2">
            <label for="have" class="text-900 leading-none font-medium">В наличии</label>
            <Checkbox inputId="have" v-model="form.have" :binary="true" />
          </div>

          <div class="flex items-center gap-2">
            <label for="can_deliver" class="text-900 leading-none font-medium"
              >Можно доставить</label
            >
            <Checkbox inputId="can_deliver" v-model="form.can_deliver" :binary="true" />
          </div>

          <div class="flex items-center gap-2">
            <label for="active" class="text-900 leading-none font-medium">Активно</label>
            <Checkbox inputId="active" v-model="form.active" :binary="true" />
          </div>
        </div>

        <Button
          class="w-full flex items-center p-4 mt-8"
          type="submit"
          label="Создать"
          :loading="createDishMutation.isLoading"
          :disabled="createDishMutation.isLoading || (isImageSelected && !isImageUploaded)"
        />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Category, CreateDish } from '@/interfaces'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { ref, reactive, watch, computed } from 'vue'
import { axiosPrivate } from '@/network'
import { useToast } from 'primevue/usetoast'
import type { FileUploadSelectEvent, FileUploadUploaderEvent } from 'primevue/fileupload'

const toast = useToast()

const possibleCardColors = ref([
  { label: 'Белый', code: 'white' },
  { label: 'Оранжевый', code: 'orange' },
  { label: 'Желтый', code: 'yellow' },
  { label: 'Желтозеленый', code: 'yellowgreen' },
  { label: 'Синий', code: 'blue' }
])

const form = reactive<CreateDish>({
  active: false,
  belki: undefined,
  can_deliver: false,
  category_id: undefined,
  color: '',
  count: 0,
  description: '',
  energy: undefined,
  have: false,
  iiko_id: undefined,
  img: '',
  name: '',
  price: undefined,
  sale_price: undefined,
  size: undefined,
  uglevodi: undefined,
  weight: undefined,
  ziri: undefined
})

const imageURL = ref<string>()
const isImageSelected = ref(false)
const isImageUploading = ref(false)
const isImageUploaded = ref(false)

const selectedCardColor = ref()
const selectedCategory = ref()
watch([selectedCardColor], () => (form.color = selectedCardColor.value.code))
watch([selectedCategory], () => (form.category_id = selectedCategory.value.code))

const createDishMutation = reactive(
  useMutation({
    mutationFn: async (payload: any) => (await axiosPrivate.put('admin/dish', payload)).data,
    onSuccess(data, variables) {
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Успешно',
        detail: `Добавлено блюдо ${variables.name}`
      })
    },
    onError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось создать блюдо'
      })
    }
  })
)

const { data: categoriesDataQuery } = useQuery<{
  items: Category[]
  total: number
}>({
  queryKey: ['categories'],
  queryFn: async () => {
    const response = await axiosPrivate.get('admin/categories', {
      params: {
        limit: 99999999,
        offset: 0
      }
    })
    return response.data
  }
})

const possibleCategories = computed(() => {
  if (categoriesDataQuery.value) {
    return categoriesDataQuery.value.items.map((item) => ({
      label: item.name,
      code: item.id
    }))
  }
  return []
})

const onSubmit = (e: Event) => {
  createDishMutation.mutate(form)
}

const fileUploader = (e: FileUploadUploaderEvent) => {
  const files = e.files as any
  const formData = new FormData()
  formData.append('image', files[0])
  isImageUploading.value = true
  isImageUploaded.value = false
  axiosPrivate
    .post('admin/upload', formData)
    .then((response) => {
      form.img = response.data.fileLink
      isImageUploaded.value = true
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Не удалось загрузить файл',
        detail: error
      })
    })
    .finally(() => {
      isImageUploading.value = false
    })
}

const onSelect = (e: FileUploadSelectEvent) => {
  console.log(e.files)
  isImageSelected.value = true
  isImageUploaded.value = false
  imageURL.value = e.files[0].objectURL
}

const visible = ref(false)
</script>
