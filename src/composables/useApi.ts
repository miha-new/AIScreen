import { ref } from 'vue'
import { apiService } from '@/api'
import type { AxiosError } from 'axios'
import type { LoginData } from '@/api/types'

export function useApi() {
  const loading = ref(false)
  const error = ref<AxiosError | null>(null)

  const execute = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (err) {
      error.value = err as AxiosError
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,

    login: (data: LoginData) => execute(() => apiService.login(data)),
  }
}
