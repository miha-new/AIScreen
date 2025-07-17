<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  clickable: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const mergedClasses = computed(() => ({
  tag: true,
  'tag-clickable': props.clickable,
  'tag-active': props.active,
}))
</script>

<template>
  <div :class="mergedClasses" tabindex="0">
    <slot />
  </div>
</template>
