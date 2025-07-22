<script setup lang="ts">
import { reactive } from 'vue'
import { type CreateTemplateParams } from '@/api/types'
import { useValidate } from '@/composables/useValidate'
import BaseLabel from '@/components/BaseLabel.vue'
import BaseInput from '@/components/BaseInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import BaseButton from '@/components/BaseButton.vue'
import FileInput from '@/components/FileInput.vue'
import TagInput from '@/components/TagInput.vue'

defineProps({
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

const emit = defineEmits(['submit'])

const { errors, rules, validateField, validateForm, isValid, clearErrors } = useValidate()

const formData = reactive<CreateTemplateParams>({
  name: '',
  width: '',
  height: '',
  tags: [],
  preview_image: undefined,
})

const handleClear = () => {
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

  if (isValid) emit('submit', formData, handleClear)
}
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
          Create
        </BaseButton>
        <ErrorMessage :show="!!errorMessage" :message="errorMessage" class="text-center" />
      </div>
    </fieldset>
  </form>
</template>
