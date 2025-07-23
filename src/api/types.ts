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

export type TemplateTag = string

export interface TemplatesFilterParams {
  name?: string
  tags?: TemplateTag[]
}

export interface TemplatesParams {
  filter?: TemplatesFilterParams
}

export interface TemplateParams {
  id: number
}

export interface CreateTemplateParams<T = File> {
  name: string
  width: string
  height: string
  tags: string[]
  preview_image?: T
}

export interface UpdateTemplateParams extends TemplateParams, CreateTemplateParams<File> {}

export interface Template extends TemplateParams, CreateTemplateParams<string> {
  [key: string]: unknown
}

export interface TemplateDraft extends CreateTemplateParams<string | File> {
  id?: number
}
