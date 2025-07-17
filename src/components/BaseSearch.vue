<script setup lang="ts">
import { watch } from 'vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'search'])
const debouncedSearch = debounce((value) => emit('search', value), 500)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  debouncedSearch(target.value)
}

const handleSearch = () => {
  debouncedSearch.cancel()
  emit('search')
}

const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('blur', target.value)
  handleSearch()
}

watch(
  () => props.modelValue,
  (newValue: string) => {
    debouncedSearch(newValue)
  },
)
</script>

<template>
  <input
    :value="modelValue"
    @input="handleInput"
    @blur="handleBlur"
    type="search"
    placeholder="Search..."
    class="search"
  />
</template>
