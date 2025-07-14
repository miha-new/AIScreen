import { ref, computed } from 'vue'

type ValidationRule = (value: string) => string | boolean
type ValidationErrors = Record<string, string>

export function useValidate() {
  const errors = ref<ValidationErrors>({})

  const rules = {
    required: (value: string) => !!value || 'Please fill in this field',
    email: (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Please enter a valid email address'
    },
    minLength: (length: number) => (value: string) =>
      value.length >= length || `Password must be at least ${length} characters`,
  }

  const validateField = (field: string, value: string, fieldRules: ValidationRule[]) => {
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

  const validateForm = (fields: Record<string, { value: string; rules: ValidationRule[] }>) => {
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
  }
}
