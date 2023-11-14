<template>
  <div
    class="w-full h-full flex flex-col items-center border-2 p-4 transition-colors"
    :class="{
      'border-red-400': errorMessage,
      'border-gray': !errorMessage
    }"
  >
    <div class="grow basis-0 min-h-[10rem] flex items-center justify-center">
      <Transition name="fade" mode="out-in">
        <div v-if="isUploading">Загружаем...</div>
        <img
          v-else-if="value"
          class="h-full w-full rounded-md object-contain object-center drop-shadow-md"
          :src="value"
          alt=""
        />
        <div v-else class="w-full aspect-square flex items-center text-center justify-center">
          Выберите картинку
        </div>
      </Transition>
    </div>

    <small class="p-error my-2">{{ errorMessage || '&nbsp;' }}</small>

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
</template>

<script setup lang="ts">
import { axiosPrivate } from '@/network'
import type { FileUploadSelectEvent, FileUploadUploaderEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { useField } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps<{
  name: string
  uploadRoute: string
  filenamePropInRequest: string
  filenamePropInResponse: string
}>()

const toast = useToast()
const { setValue, value, errorMessage } = useField<string>(() => props.name)

const fileBlobURL = ref<string>()
const isSelected = ref(false)
const isUploading = ref(false)
const isUploaded = ref(false)

const fileUploader = (e: FileUploadUploaderEvent) => {
  const files = e.files as any
  const formData = new FormData()
  formData.append(props.filenamePropInRequest, files[0])
  isUploading.value = true
  isUploaded.value = false
  axiosPrivate
    .post(props.uploadRoute, formData)
    .then((response) => {
      setValue(response.data[props.filenamePropInResponse])
      isUploaded.value = true
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
      isUploading.value = false
    })
}

const onSelect = (e: FileUploadSelectEvent) => {
  isSelected.value = true
  isUploaded.value = false
  fileBlobURL.value = e.files[0].objectURL
}
</script>
