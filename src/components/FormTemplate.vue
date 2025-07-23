<script setup lang="ts">
import { reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTemplateStore } from '@/stores/templates'
import type { Template, TemplateDraft } from '@/api/types'
import { useValidate } from '@/composables/useValidate'
import BaseLabel from '@/components/BaseLabel.vue'
import BaseInput from '@/components/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import BaseButton from '@/components/BaseButton.vue'
import FileInput from '@/components/FileInput.vue'
import TagInput from '@/components/TagInput.vue'

const props = defineProps({
  modelValue: {
    type: Object as () => Template,
    default: () => {},
  },
  tags: {
    type: Array as () => string[],
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const store = useTemplateStore()

const { templateDraft } = storeToRefs(store)
const { setTemplateDraft } = store

const emit = defineEmits(['submit'])

const { errors, rules, validateField, validateForm, isValid, clearErrors } = useValidate()

const templateDraftId = templateDraft.value?.id
const modelValueId = props.modelValue?.id
const isSameIds = templateDraftId === modelValueId
const data = isSameIds ? templateDraft.value : props.modelValue

const formData = reactive<TemplateDraft>({
  id: data?.id,
  name: data?.name || '',
  width: data?.width?.replace('px', '') || '',
  height: data?.height?.replace('px', '') || '',
  tags: data?.tags || [],
  preview_image: data?.preview_image || undefined,
})

const handleClear = () => {
  formData.id = undefined
  formData.name = ''
  formData.width = ''
  formData.height = ''
  formData.tags = []
  formData.preview_image = undefined
  clearErrors()
}

const handleSubmit = () => {
  const isValid = validateForm({
    name: { value: formData.name, rules: [rules.required] },
    width: { value: formData.width, rules: [rules.required] },
    height: { value: formData.height, rules: [rules.required] },
    tags: { value: formData.tags, rules: [rules.requiredTags] },
  })

  if (isValid) {
    const params = {
      ...formData,
      width: `${formData.width}px`,
      height: `${formData.height}px`,
    }

    emit('submit', params, handleClear)
  }
}

watch(
  () => formData,
  (newData) => {
    setTemplateDraft(newData)
  },
  { deep: true },
)
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <fieldset class="space-y-5" :disabled="loading">
      <div class="relative">
        <BaseLabel htmlFor="name" text="Name" />
        <BaseInput
          id="name"
          name="name"
          type="text"
          placeholder="Enter name"
          v-model="formData.name"
          :error="!!errors.name"
          @validate="() => validateField('name', formData.name, [rules.required])"
        />
        <ErrorMessage :show="!!errors.name" :message="errors.name" />
      </div>
      <div class="relative flex gap-4">
        <div class="flex-1">
          <BaseLabel htmlFor="width" text="Width" />
          <div class="relative">
            <BaseInput
              id="width"
              name="width"
              type="number"
              inputmode="numeric"
              placeholder="Enter width"
              min="0"
              v-model="formData.width"
              :error="!!errors.width"
              @validate="() => validateField('width', formData.width, [rules.required])"
            />
            <div class="absolute inset-y-0 right-0 flex items-center">
              <div class="h-5 w-5 text-gray-500">px</div>
            </div>
          </div>
          <ErrorMessage :show="!!errors.width" :message="errors.width" />
        </div>
        <div class="flex-1">
          <BaseLabel htmlFor="height" text="Height" />
          <div class="relative">
            <BaseInput
              id="height"
              name="height"
              type="number"
              inputmode="numeric"
              placeholder="Enter height"
              min="0"
              v-model="formData.height"
              :error="!!errors.height"
              @validate="() => validateField('height', formData.height, [rules.required])"
            />
            <div class="absolute inset-y-0 right-0 flex items-center">
              <div class="h-5 w-5 text-gray-500">px</div>
            </div>
          </div>
          <ErrorMessage :show="!!errors.height" :message="errors.height" />
        </div>
      </div>
      <div class="relative">
        <BaseLabel htmlFor="tags" text="Tags" />
        <TagInput
          id="tags"
          name="tags"
          v-model="formData.tags"
          :tags="tags"
          :error="!!errors.tags"
          @validate="() => validateField('tags', formData.tags, [rules.requiredTags])"
        >
          <template #errorMessage>
            <ErrorMessage :show="!!errors.tags" :message="errors.tags" />
          </template>
        </TagInput>
      </div>
      <div class="relative">
        <FileInput v-model="formData.preview_image" />
      </div>
      <div class="relative">
        <BaseButton class="btn-primary" type="submit" :disabled="!isValid" :loading="loading">
          {{ modelValue?.id ? 'Save' : 'Create' }}
        </BaseButton>
        <ErrorMessage :show="!!errorMessage" :message="errorMessage" class="text-center" />
      </div>
    </fieldset>
  </form>
</template>
