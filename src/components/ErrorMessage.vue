<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  transitionClass: {
    type: String,
    default: 'transition-opacity duration-150',
  },
  textClass: {
    type: String,
    default: 'text-sm text-red-600 mt-1',
  },
})
</script>

<template>
  <TransitionRoot
    :show="show"
    :enter="transitionClass"
    enter-from="opacity-0"
    enter-to="opacity-100"
  >
    <p :class="textClass">{{ message }}</p>
  </TransitionRoot>
</template>
