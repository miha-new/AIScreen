import { ref } from 'vue'
import { apiService } from '@/api'
import type { AxiosError } from 'axios'
import type {
  CreateTemplateParams,
  LoginParams,
  TemplateParams,
  TemplatesParams,
  UpdateTemplateParams,
} from '@/api/types'

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

    login: (params: LoginParams) => execute(() => apiService.login(params)),

    getTemplates: (params?: TemplatesParams) => execute(() => apiService.getTemplates(params)),
    getTemplate: (params: TemplateParams) => execute(() => apiService.getTemplate(params)),
    getTemplateTags: () => execute(() => apiService.getTemplateTags()),
    createTemplate: (params: CreateTemplateParams) =>
      execute(() => apiService.createTemplate(params)),
    updateTemplate: (params: UpdateTemplateParams) =>
      execute(() => apiService.updateTemplate(params)),
    deleteTemplate: (params: TemplateParams) => execute(() => apiService.deleteTemplate(params)),
  }
}
