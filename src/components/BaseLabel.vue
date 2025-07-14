<script setup lang="ts">
defineProps({
  htmlFor: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <label :for="htmlFor" class="label">
    {{ text }}
    <span v-if="required" class="text-red-600">*</span>
  </label>
</template>
