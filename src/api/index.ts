import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios'
import type {
  LoginParams,
  AuthResponse,
  TemplateTag,
  TemplatesParams,
  TemplateParams,
  Template,
  CreateTemplateParams,
  UpdateTemplateParams,
} from './types'

class ApiService {
  private publicApi: AxiosInstance
  private authApi: AxiosInstance

  constructor() {
    const baseConfig = {
      baseURL: 'https://dev-api.aiscreen.io/api/v1',
    }

    this.publicApi = axios.create(baseConfig)
    this.publicApi.interceptors.response.use(this.handleSuccess, this.handleAuthError)

    this.authApi = axios.create(baseConfig)
    this.authApi.interceptors.request.use(this.addAuthToken)
    this.authApi.interceptors.response.use(this.handleSuccess, this.handleError)
  }

  private addAuthToken(config: InternalAxiosRequestConfig) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }

  private handleSuccess(response: AxiosResponse) {
    return response.data
  }

  private handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }

  private handleAuthError(error: AxiosError) {
    return Promise.reject(error.response?.data || error)
  }

  public async login(params: LoginParams): Promise<AuthResponse> {
    return this.publicApi.post('/login', params)
  }

  public async getTemplates(params?: TemplatesParams): Promise<Template[]> {
    return this.authApi.get('/canvas_templates', { params })
  }
  public async getTemplate(params: TemplateParams): Promise<Template> {
    return this.authApi.get(`/canvas_templates/${params.id}`)
  }
  public async getTemplateTags(): Promise<TemplateTag[]> {
    return this.authApi.get('/canvas_templates/tags/list')
  }
  public async createTemplate(params: CreateTemplateParams): Promise<void> {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const formData = new FormData()
    formData.append('name', params.name)
    formData.append('width', params.width)
    formData.append('height', params.height)

    params.tags.forEach((tag) => {
      formData.append('tags[]', tag)
    })

    if (params.preview_image instanceof File) {
      const file = new Blob([params.preview_image], { type: 'text/plain' })
      formData.append('preview_image', file)
    }

    return this.authApi.post('/canvas_templates', formData, { headers })
  }
  public async updateTemplate(params: UpdateTemplateParams): Promise<void> {
    const headers = { 'Content-Type': 'multipart/form-data' }

    const formData = new FormData()
    formData.append('name', params.name)
    formData.append('width', params.width)
    formData.append('height', params.height)

    params.tags.forEach((tag) => {
      formData.append('tags[]', tag)
    })

    if (params.preview_image) {
      const file = new Blob([params.preview_image], { type: 'text/plain' })
      formData.append('preview_image', file)
    }

    return this.authApi.post(`/canvas_templates/${params.id}?_method=PATCH`, formData, { headers })
  }
  public async deleteTemplate(params: TemplateParams): Promise<void> {
    return this.authApi.delete('/canvas_templates', { params })
  }
}

export const apiService = new ApiService()
