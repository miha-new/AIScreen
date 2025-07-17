import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios'
import type {
  LoginParams,
  AuthResponse,
  TemplatesTag,
  TemplatesParams,
  TemplateParams,
  Template,
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

  public async login(data: LoginParams): Promise<AuthResponse> {
    return this.publicApi.post('/login', data)
  }

  public async templates(params?: TemplatesParams): Promise<Template[]> {
    return this.authApi.get('/canvas_templates', { params })
  }
  public async template(params: TemplateParams): Promise<Template> {
    return this.authApi.get(`/canvas_templates/${params.id}`)
  }
  public async templatesTags(): Promise<TemplatesTag[]> {
    return this.authApi.get('/canvas_templates/tags/list')
  }
}

export const apiService = new ApiService()
