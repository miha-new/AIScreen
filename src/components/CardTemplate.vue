<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'
import BaseConfirm from '@/components/ModalConfirm.vue'

const props = defineProps({
  template: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['delete'])
const router = useRouter()
const confirmDialog = ref<InstanceType<typeof BaseConfirm> | null>(null)

const handleConfirm = (): void => {
  confirmDialog.value?.openModal()
}

const handleSeeMore = () => {
  router.push({
    name: 'template',
    params: { id: props.template.id },
  })
}
const handleDelete = () => {
  emit('delete', props.template.id)
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
      <BaseButton class="btn-danger" @click="handleConfirm">Delete</BaseButton>
      <BaseButton class="btn-primary" @click="handleSeeMore">See more</BaseButton>
    </div>
    <BaseConfirm
      ref="confirmDialog"
      title="Delete Confirmation"
      message="Are you sure you want to delete this template? This action cannot be undone."
      confirm-text="Delete"
      @confirm="handleDelete"
    />
  </div>
</template>
