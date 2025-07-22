<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'div',
  },
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
  <component :is="as" :class="mergedClasses">
    <slot />
  </component>
</template>
