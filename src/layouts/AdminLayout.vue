<script setup lang="ts">
import AdminHeader from '@/components/AdminHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AdminHeader />
    <main class="flex-1 container mx-auto py-3 px-4">
      <slot />
    </main>
  </div>
</template>
