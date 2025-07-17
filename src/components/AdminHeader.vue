<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const handleLogout = async () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-xs border-b border-gray-800 z-50"
  >
    <div class="container h-[50px] mx-auto py-3 px-4 flex items-center justify-between">
      <RouterLink
        to="/"
        class="transition duration-200 ease-in-out hover:opacity-70 focus:outline-none focus:opacity-70"
      >
        <img class="block w-24 h-auto" src="/images/logo.svg" alt="" />
      </RouterLink>
      <button
        class="text-sm font-medium text-white select-none cursor-pointer transition duration-200 ease-in-out hover:text-white/70 focus:outline-none focus:text-white/80"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </header>
</template>
