<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = async () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <main>
    <h1>Home</h1>
    <button @click="handleLogout">Logout</button>
  </main>
</template>
