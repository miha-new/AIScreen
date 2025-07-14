// import axios, {
//   type AxiosInstance,
//   type AxiosResponse,
//   type InternalAxiosRequestConfig,
//   type AxiosError,
// } from 'axios'
// import type { LoginData, AuthResponse } from './types'

// class ApiService {
//   private api: AxiosInstance

//   constructor() {
//     this.api = axios.create({
//       baseURL: 'https://dev-api.aiscreen.io/api/v1',
//     })

//     this.api.interceptors.request.use(this.addAuthToken)
//     this.api.interceptors.response.use(this.handleSuccess, this.handleError)
//   }

//   private addAuthToken(config: InternalAxiosRequestConfig) {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers = config.headers || {}
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   }

import axios, {
  type AxiosInstance,
  // type AxiosResponse,
  // type InternalAxiosRequestConfig,
  // type AxiosError,
} from 'axios'
import type { LoginData, AuthResponse } from './types'

class ApiService {
  private publicApi: AxiosInstance
  // private authApi: AxiosInstance

  constructor() {
    const baseConfig = {
      baseURL: 'https://dev-api.aiscreen.io/api/v1',
    }

    this.publicApi = axios.create(baseConfig)

    // this.authApi = axios.create(baseConfig)
    // this.authApi.interceptors.request.use(this.addAuthToken)
    // this.authApi.interceptors.response.use(this.handleSuccess, this.handleError)
  }

  // private addAuthToken(config: InternalAxiosRequestConfig) {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     config.headers = config.headers || {}
  //     config.headers.Authorization = `Bearer ${token}`
  //   }
  //   return config
  // }

  // private handleSuccess(response: AxiosResponse) {
  //   return response.data
  // }

  // private handleError(error: AxiosError) {
  //   if (error.response?.status === 401) {
  //     localStorage.removeItem('token')
  //     window.location.href = '/login'
  //   }
  //   return Promise.reject(error.response?.data || error)
  // }

  public async login(data: LoginData): Promise<AuthResponse> {
    return this.publicApi.post('/login', data)
  }
}

export const apiService = new ApiService()
