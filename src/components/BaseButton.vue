<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="btn">
    <span v-if="loading" class="loader" />
    <span v-else>
      <slot />
    </span>
  </button>
</template>
