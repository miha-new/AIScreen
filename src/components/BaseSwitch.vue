<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const toggle = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch
      :modelValue="modelValue"
      @update:modelValue="toggle"
      :class="['switch', modelValue ? 'bg-indigo-600' : 'bg-gray-200']"
    >
      <span
        aria-hidden="true"
        :class="['switch-marker', modelValue ? 'translate-x-5' : 'translate-x-0']"
      />
    </Switch>
    <SwitchLabel v-if="label" as="span" class="label ml-3">
      {{ label }}
    </SwitchLabel>
  </SwitchGroup>
</template>
