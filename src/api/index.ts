import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios'
import type { LoginData, AuthResponse } from './types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://dev-api.aiscreen.io/api/v1',
    })

    this.api.interceptors.request.use(this.addAuthToken)
    this.api.interceptors.response.use(this.handleSuccess, this.handleError)
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

  // Auth methods
  public async login(data: LoginData): Promise<AuthResponse> {
    return this.api.post('/login', data)
  }
}

export const apiService = new ApiService()
