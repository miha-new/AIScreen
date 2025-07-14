<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import type { LoginData } from '@/api/types'
import { useValidate } from '@/composables/useValidate'
import BaseLabel from '@/components/BaseLabel.vue'
import BaseInput from '@/components/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import BaseSwitch from '@/components/BaseSwitch.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()

const { loading: authLoading, error: authError, login } = useApi()
const { errors, rules, validateField, validateForm, isValid } = useValidate()

const emailRules = [rules.required, rules.email]
const passwordRules = [rules.required, rules.minLength(6)]

const authErrorMessage = ref<string>('')
const formData = ref<LoginData>({
  email: '',
  password: '',
  remember_me: 0,
})

const handleValidateEmail = (value: string): boolean => {
  return validateField('email', value, emailRules)
}
const handleValidatePassword = (value: string): boolean => {
  return validateField('password', value, passwordRules)
}
const handleRemember = (value: boolean): number => {
  return (formData.value.remember_me = value ? 1 : 0)
}

const handleLogin = async () => {
  authErrorMessage.value = ''
  const response = await login(formData.value)

  if (response && !authError.value) {
    localStorage.setItem('token', response.token)
    router.push('/')
  } else {
    authErrorMessage.value = 'Login failed. Please try again'

    if (authError.value?.response) {
      const { status } = authError.value.response
      if (status === 401 || status === 403) {
        authErrorMessage.value = 'Invalid username or password. Please try again.'
      } else if (status === 503) {
        authErrorMessage.value = 'Server unavailable. Please try again later.'
      }
    } else if (authError.value?.request) {
      authErrorMessage.value = 'Network error. Please check your connection.'
    }

    console.error('Auth error:', authError.value)
  }
}

const handleSubmit = () => {
  const isValid = validateForm({
    email: { value: formData.value.email, rules: emailRules },
    password: { value: formData.value.password, rules: passwordRules },
  })

  if (isValid) handleLogin()
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center min-h-full p-4">
    <div class="card w-full max-w-[480px] p-4">
      <h2 class="h1 text-center mb-4">Sign In to Manager</h2>
      <form @submit.prevent="handleSubmit">
        <fieldset class="space-y-5" :disabled="authLoading">
          <div class="relative">
            <BaseLabel htmlFor="email" text="Email" />
            <BaseInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              v-model="formData.email"
              :error="!!errors.email"
              @validate="handleValidateEmail"
            />
            <ErrorMessage :show="!!errors.email" :message="errors.email" />
          </div>
          <div class="relative">
            <BaseLabel htmlFor="password" text="Password" />
            <BaseInput
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              v-model="formData.password"
              :error="!!errors.password"
              @validate="handleValidatePassword"
            />
            <ErrorMessage :show="!!errors.password" :message="errors.password" />
          </div>
          <BaseSwitch
            :modelValue="!!formData.remember_me"
            @update:modelValue="handleRemember"
            label="Remember me"
          />
          <div class="relative">
            <BaseButton
              class="btn-primary"
              type="submit"
              :disabled="!isValid"
              :loading="authLoading"
            >
              Sign in
            </BaseButton>
            <ErrorMessage
              :show="!!authErrorMessage"
              :message="authErrorMessage"
              class="text-center"
            />
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
