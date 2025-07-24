<script setup lang="ts">
import { watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  position: {
    type: String as () => 'left' | 'right',
    default: 'right',
    validator: (value: string) => ['left', 'right'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog :static="true" as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 flex max-w-full"
            :class="position === 'right' ? 'right-0' : 'left-0'"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-300"
              leave="transform transition ease-in-out duration-300"
              :enter-from="position === 'right' ? 'translate-x-full' : '-translate-x-full'"
              :enter-to="position === 'right' ? 'translate-x-0' : 'translate-x-0'"
              :leave-from="position === 'right' ? 'translate-x-0' : 'translate-x-0'"
              :leave-to="position === 'right' ? 'translate-x-full' : '-translate-x-full'"
            >
              <DialogPanel
                class="pointer-events-auto relative w-screen max-w-md"
                :class="position === 'right' ? 'pl-10' : 'pr-10'"
              >
                <div class="flex h-full flex-col bg-white shadow-xl">
                  <div class="flex items-middle justify-between p-4">
                    <DialogTitle class="h1">
                      {{ title }}
                    </DialogTitle>
                    <button
                      type="button"
                      class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                      @click="closeModal"
                    >
                      <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="relative flex-1 p-4 overflow-y-auto">
                    <slot></slot>
                  </div>

                  <div v-if="$slots.footer" class="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <slot name="footer"></slot>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
