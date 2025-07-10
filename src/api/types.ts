export interface LoginData {
  email: string
  password: string
  remember_me: number
}

export interface AuthResponse {
  token: string
  user?: AuthUser
}

export interface AuthUser {
  id: number
  uuid: number
  position: string
  on_trial: boolean
}
