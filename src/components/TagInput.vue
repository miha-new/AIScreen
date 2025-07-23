<script setup lang="ts">
import { ref, computed } from 'vue'
import { OnClickOutside } from '@vueuse/components'
import { Combobox, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon, XMarkIcon, PlusCircleIcon } from '@heroicons/vue/20/solid'
import BaseInput from '@/components/BaseInput.vue'
import BaseTag from '@/components/BaseTag.vue'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
  tags: {
    type: Array as () => string[],
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Enter tag',
  },
  error: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'validate'])

const query = ref('')
const wasOpened = ref(false)
const open = ref(false)
const focus = ref(false)

const filteredTags = computed(() => {
  const searchQuery = query.value.toLowerCase().trim()
  const queryWords = searchQuery.split(/\s+/).filter(Boolean)
  const selectedTags = props.modelValue.map((word) => word.toLowerCase())
  const withoutSelectedTags = props.tags.filter((item) => {
    const lowerItem = item.toLowerCase()
    return !selectedTags.some((word) => lowerItem.includes(word))
  })

  if (!query.value.trim()) return withoutSelectedTags

  return withoutSelectedTags
    .map((item) => {
      const lowerItem = item.toLowerCase()
      let score = 0

      queryWords.forEach((word) => {
        const index = lowerItem.indexOf(word)

        if (index !== -1) {
          score += word.length
          if (lowerItem === word) score += 10
          if (index === 0) score += 5
        }
      })

      return { item, score }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item)
})

const canAddCustomTag = computed(() => {
  return (
    query.value.trim() &&
    !props.modelValue.includes(query.value.trim()) &&
    !props.tags.some((s) => s.toLowerCase() === query.value.trim().toLowerCase())
  )
})

const isShowAutocomplete = computed(
  () => (query.value.trim() && filteredTags.value.length > 0) || canAddCustomTag.value,
)

const handleValidate = () => {
  emit('validate', props.modelValue)
}

const addTag = (newTag: string) => {
  const trimmedTag = newTag.trim()
  if (!trimmedTag) return
  if (!props.modelValue.includes(trimmedTag)) {
    const newTags = [...props.modelValue, trimmedTag]
    emit('update:modelValue', newTags)
  }

  query.value = ''
  handleValidate()
}

const removeTag = (tagToRemove: string) => {
  const newTags = props.modelValue.filter((tag) => tag !== tagToRemove)
  emit('update:modelValue', newTags)
  handleValidate()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()

    if (query.value.trim()) {
      if (filteredTags.value.length > 0) {
        addTag(filteredTags.value[0])
      } else {
        addTag(query.value)
      }
    }
  }
}

const handleComboboxSelect = (tag: string | null) => {
  if (!tag) return

  if (tag === '$$custom$$') {
    addTag(query.value)
  } else {
    addTag(tag)
  }
}

const handleToggleOpen = () => {
  if (!wasOpened.value) {
    open.value = !isShowAutocomplete.value
    wasOpened.value = true
  } else {
    open.value = !open.value
  }
}
const handleClose = () => {
  wasOpened.value = false
  open.value = false
}
const handleFocus = () => (focus.value = true)
const handleBlur = () => (focus.value = false)
</script>

<template>
  <div class="w-full">
    <OnClickOutside @trigger="handleClose">
      <Combobox as="div" @update:modelValue="handleComboboxSelect" nullable>
        <div class="relative">
          <BaseInput
            :id="id"
            :name="name"
            type="text"
            class="pr-6"
            :placeholder="placeholder"
            :error="error"
            v-model="query"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown="handleKeyDown"
            @validate="handleValidate"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
            :disabled="!(filteredTags.length > 0)"
            @click="handleToggleOpen"
          >
            <ChevronUpDownIcon class="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <template v-if="wasOpened || (focus && isShowAutocomplete)">
          <ComboboxOptions
            v-if="!wasOpened || (open && filteredTags.length > 0)"
            class="card absolute z-10 mt-1 max-h-60 w-full overflow-auto py-1 text-base border border-gray-300"
            static
          >
            <ComboboxOption
              v-if="canAddCustomTag"
              key="custom-tag"
              value="$$custom$$"
              as="template"
              v-slot="{ active }"
            >
              <li
                :class="`relative select-none cursor-pointer py-2 px-3 ${
                  active ? 'text-white bg-indigo-500' : 'bg-white'
                }`"
              >
                <div class="flex items-center gap-2">
                  <PlusCircleIcon :class="`h-5 w-5 ${active ? 'text-white' : 'text-indigo-500'}`" />
                  <div class="truncate">Add "{{ query.trim() }}"</div>
                </div>
              </li>
            </ComboboxOption>

            <ComboboxOption
              v-for="tag in filteredTags"
              :key="tag"
              :value="tag"
              as="template"
              v-slot="{ active }"
            >
              <li
                :class="`relative cursor-pointer select-none py-2 px-3 ${
                  active ? 'text-white bg-indigo-500' : 'bg-white'
                }`"
              >
                <div class="truncate">
                  {{ tag }}
                </div>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </template>
      </Combobox>
    </OnClickOutside>

    <slot name="errorMessage" />

    <div v-if="modelValue.length" class="flex flex-wrap gap-2 mt-2">
      <BaseTag
        v-for="tag in modelValue"
        :key="tag"
        class="tag-primary"
        as="button"
        :clickable="true"
        @keyup.enter="removeTag(tag)"
        @click="removeTag(tag)"
      >
        {{ tag }}
        <XMarkIcon class="ml-0.5 h-4 w-4" />
      </BaseTag>
    </div>
  </div>
</template>
