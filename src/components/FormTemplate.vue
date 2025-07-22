<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useApi } from '@/composables/useApi'
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
})

const { loading: createTemplateLoading, error: createTemplateError, createTemplate } = useApi()
const { errors, rules, validateField, validateForm, isValid } = useValidate()

const createErrorMessage = ref<string>('')

const formData = reactive<CreateTemplateParams>({
  name: '',
  width: '',
  height: '',
  tags: [],
  preview_image: undefined,
})

const handleCreateTemplate = async () => {
  createErrorMessage.value = ''

  const response = await createTemplate(formData)

  if (response && !createTemplateError.value) {
    console.log('success')
  } else {
    createErrorMessage.value = 'Create template failed. Please try again'

    if (createTemplateError.value?.response) {
      const { status } = createTemplateError.value.response
      if (status === 422) {
        createErrorMessage.value = 'Invalid data in the form. Please try again.'
        console.log('error', 422)
      } else if (status === 503) {
        createErrorMessage.value = 'Server unavailable. Please try again later.'
        console.log('error', 503)
      }
    } else if (createTemplateError.value?.request) {
      console.log('other error')
      createErrorMessage.value = 'Network error. Please check your connection.'
    }

    console.error('Create template error:', createTemplateError.value)
  }
}

const handleSubmit = () => {
  const isValid = validateForm({
    name: { value: formData.name, rules: [rules.required] },
    width: { value: formData.width, rules: [rules.required] },
    height: { value: formData.height, rules: [rules.required] },
    tags: { value: formData.tags, rules: [rules.requiredTags] },
  })

  if (isValid) handleCreateTemplate()
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <fieldset class="space-y-5" :disabled="createTemplateLoading">
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
        <BaseButton
          class="btn-primary"
          type="submit"
          :disabled="!isValid"
          :loading="createTemplateLoading"
          >Create</BaseButton
        >
      </div>
    </fieldset>
  </form>
</template>
