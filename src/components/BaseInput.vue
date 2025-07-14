<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'validate'])

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('blur', target.value)
  emit('validate', target.value)
}
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
