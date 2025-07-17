export interface LoginParams {
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

export type TemplatesTag = string

export interface TemplatesFilterParams {
  name?: string
  tags?: TemplatesTag[]
}

export interface TemplatesParams {
  filter?: TemplatesFilterParams
}

export interface TemplateParams {
  id: number
}

export interface Template {
  id: number
  name: string
  width?: string
  height?: string
  preview_image?: string
  type?: string
  objects?: string[] | null
  tags?: string[] | null
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
}

export interface CreateTemplateParams {
  name: string
  objects: null
  tags?: string[] | null
  width?: string
  height?: string
  preview_image?: string
}
