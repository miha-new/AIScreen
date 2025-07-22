<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

withDefaults(
  defineProps<{
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
  }>(),
  {
    title: 'Confirm Action',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  },
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const isOpen = ref(false)

const openModal = (): void => {
  isOpen.value = true
}

const closeModal = (): void => {
  isOpen.value = false
  emit('cancel')
}

const confirmAction = (): void => {
  emit('confirm')
  closeModal()
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <teleport to="body">
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-[100]">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="card w-full max-w-md transform overflow-hidden p-4 text-left align-middle transition-all"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-800">
                  {{ title }}
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>

                <div class="mt-4 flex justify-end space-x-4">
                  <BaseButton class="btn-primary" @click="closeModal">{{ cancelText }}</BaseButton>
                  <BaseButton class="btn-danger" @click="confirmAction">{{
                    confirmText
                  }}</BaseButton>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </teleport>
</template>
