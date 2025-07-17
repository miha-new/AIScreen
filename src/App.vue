<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()

const layout = computed(() => {
  return route.meta.layout === 'AdminLayout' ? AdminLayout : DefaultLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
