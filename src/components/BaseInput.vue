<script setup lang="ts">
import { watch } from 'vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'validate'])
const debouncedValidate = debounce((value) => emit('validate', value), 500)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  debouncedValidate(target.value)
}

const handleValidate = (value: string) => {
  debouncedValidate.cancel()
  emit('validate', value)
}

const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('blur', target.value)
  handleValidate(target.value)
}

watch(
  () => props.modelValue,
  (newValue) => {
    debouncedValidate(newValue)
  },
)
</script>

<template>
  <input
    :value="modelValue"
    @input="handleInput"
    @blur="handleBlur"
    class="input"
    :class="{ 'border-red-500': props.error }"
  />
</template>
