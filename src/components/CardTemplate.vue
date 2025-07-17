<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  template: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['delete'])
const router = useRouter()

const handleSeeMore = () => {
  router.push({
    name: 'template',
    params: { id: props.template.id },
  })
}
const handleDelete = () => {
  emit('delete')
}
</script>

<template>
  <div class="card overflow-hidden space-y-4">
    <div class="flex items-center justify-center h-40 bg-gray-400">
      <img class="w-full h-full object-cover" :src="template.preview_image" alt="" />
    </div>
    <div class="px-4">
      <div class="text-lg truncate">
        {{ template.name }}
      </div>
    </div>
    <div class="flex items-center gap-3 px-4 pb-4">
      <BaseButton class="btn-danger" @click="handleDelete">Delete</BaseButton>
      <BaseButton class="btn-primary" @click="handleSeeMore">See more</BaseButton>
    </div>
  </div>
</template>
