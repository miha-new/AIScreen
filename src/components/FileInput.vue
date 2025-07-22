<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('update:modelValue', file)
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('update:modelValue', file)
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const clearFile = () => {
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openFileDialog = () => {
  fileInput.value?.click()
}

watch(
  () => props.modelValue,
  (file) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }

    if (file) {
      previewUrl.value = URL.createObjectURL(file)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="sr-only"
      @change="handleFileChange"
    />

    <div
      class="relative border-2 border-dashed rounded-[0.5rem] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] hover:border-indigo-600"
      :class="{
        'border-indigo-500 bg-indigo-50/50': isDragging,
        'border-gray-300': !isDragging,
        'border-solid p-0 overflow-hidden': previewUrl,
      }"
      @click="openFileDialog"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <template v-if="previewUrl">
        <div class="relative w-full h-full">
          <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover object-center" />
          <button
            type="button"
            class="absolute top-2 right-2 p-1 rounded-full bg-white/80 text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200 shadow-md hover:shadow-lg"
            @click.stop="clearFile"
            aria-label="Remove image"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </template>

      <template v-else>
        <div class="text-center space-y-2 p-4">
          <svg
            class="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-gray-700 font-medium">Drag your image here or click to select</p>
          <p class="text-sm text-gray-500">Supported formats: JPG, PNG, GIF, WEBP</p>
        </div>
      </template>
    </div>
  </div>
</template>
