<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import type { LoginData } from '@/api/types'

const router = useRouter()

const { error: authError, login } = useApi()

const loginForm = ref<LoginData>({
  email: 'hello@aiscreen.io',
  password: 'Demo!1234',
  remember_me: 0,
})

const handleLogin = async () => {
  const response = await login(loginForm.value)
  if (response && !authError.value) {
    localStorage.setItem('token', response.token)
    router.push('/')
  }
}
</script>

<template>
  <main>
    <h1>Auth</h1>
    <button @click="handleLogin">Login</button>
  </main>
</template>
