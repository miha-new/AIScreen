import { ref, computed } from 'vue'

type ValidationRule<T = unknown> = (value: T) => string | boolean
type ValidationErrors = Record<string, string>

interface ValidationRules {
  required: <T>(value: T) => string | boolean
  email: (value: string) => string | boolean
  minLength: (length: number) => (value: string) => string | boolean
  requiredTags: (value: string[]) => string | boolean
}

export function useValidate() {
  const errors = ref<ValidationErrors>({})
  const skipRequiredOnEmpty = ref(false)

  const clearErrors = (skipRequired = true) => {
    errors.value = {}
    skipRequiredOnEmpty.value = skipRequired
  }

  const rules: ValidationRules = {
    required: <T>(value: T) => !!value || 'Please fill in this field',
    email: (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Please enter a valid email address'
    },
    minLength: (length: number) => (value: string) =>
      value.length >= length || `Must be at least ${length} characters`,
    requiredTags: (value: string[]) => value.length > 0 || 'Please include some tags',
  }

  const validateField = <T>(field: string, value: T, fieldRules: ValidationRule<T>[]) => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)

    if (isEmpty && skipRequiredOnEmpty.value) {
      delete errors.value[field]
      return true
    }

    for (const rule of fieldRules) {
      const result = rule(value)
      if (typeof result === 'string') {
        errors.value[field] = result
        return false
      }
    }

    delete errors.value[field]
    return true
  }

  type FormField<T = unknown> = {
    value: T
    rules: ValidationRule<T>[]
  }

  type FormFields = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: FormField<any>
  }

  const validateForm = (fields: FormFields) => {
    let isValid = true
    Object.entries(fields).forEach(([field, { value, rules }]) => {
      if (!validateField(field, value, rules)) {
        isValid = false
      }
    })
    return isValid
  }

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  return {
    errors,
    rules,
    validateField,
    validateForm,
    isValid,
    clearErrors,
  }
}
