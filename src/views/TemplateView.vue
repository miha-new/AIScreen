<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTemplateStore } from '@/stores/templates'
import { useApi } from '@/composables/useApi'
import type { UpdateTemplateParams } from '@/api/types'
import BaseSidebar from '@/components/BaseSidebar.vue'
import FormTemplate from '@/components/FormTemplate.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseTag from '@/components/BaseTag.vue'

const route = useRoute()
const store = useTemplateStore()

const { templateTags, template } = storeToRefs(store)

const { setTemplateTags, setTemplate } = store

const { loading: updateTemplateLoading, error: updateTemplateError, updateTemplate } = useApi()
const { getTemplate, error: templateError } = useApi()
const { getTemplateTags, error: templateTagsError } = useApi()

const isPanelOpen = ref(false)
const createErrorMessage = ref<string>('')

const handleTemplate = async () => {
  const response = await getTemplate({ id: Number(route.params.id) })

  if (response && !templateError.value) {
    setTemplate(response)
  }
}

const handleTemplatesTags = async () => {
  const response = await getTemplateTags()

  if (response && !templateTagsError.value) {
    setTemplateTags(response)
  }
}

const handleCreateTemplate = async (params: UpdateTemplateParams) => {
  createErrorMessage.value = ''

  const response = await updateTemplate(params)

  if (response && !updateTemplateError.value) {
    setTemplate(response)
  } else {
    createErrorMessage.value = 'Create template failed. Please try again'

    if (updateTemplateError.value?.response) {
      const { status } = updateTemplateError.value.response
      if (status === 422) {
        createErrorMessage.value = 'Invalid data in the form. Please try again.'
        console.log('error', 422)
      } else if (status === 503) {
        createErrorMessage.value = 'Server unavailable. Please try again later.'
        console.log('error', 503)
      }
    } else if (updateTemplateError.value?.request) {
      console.log('other error')
      createErrorMessage.value = 'Network error. Please check your connection.'
    }

    console.error('Create template error:', updateTemplateError.value)
  }
}

onMounted(() => {
  handleTemplatesTags()
  handleTemplate()
})
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <div class="flex-1">
      <h2 class="h1">Template</h2>
    </div>
    <div class="flex-shrink-0">
      <BaseButton class="btn-primary" @click="isPanelOpen = true">Edit template</BaseButton>
    </div>
  </div>
  <template v-if="template">
    <div class="card overflow-hidden mb-4">
      <dl class="p-4">
        <dt class="label mb-1">Name:</dt>
        <dd class="text-lg/4.5 font-bold mb-4">{{ template.name }}</dd>
        <dt class="label mb-1">Tags:</dt>
        <dd class="flex gap-1 mb-4">
          <BaseTag
            v-for="(templateTagItem, index) in template.tags"
            :key="index"
            class="tag-primary"
          >
            {{ templateTagItem }}
          </BaseTag>
        </dd>
        <dt class="label mb-1">Width:</dt>
        <dd class="text-lg/4.5 font-bold mb-4">{{ template.width }}</dd>
        <dt class="label mb-1">Height:</dt>
        <dd class="text-lg/4.5 font-bold">{{ template.height }}</dd>
      </dl>
    </div>
    <div v-if="template.preview_image" class="card overflow-hidden">
      <img class="w-full h-auto object-cover" :src="template.preview_image" alt="" />
    </div>
  </template>
  <BaseSidebar :isOpen="isPanelOpen" title="Edit Template" @close="isPanelOpen = false">
    <FormTemplate
      :modelValue="template"
      :tags="templateTags"
      :error="createErrorMessage"
      :loading="updateTemplateLoading"
      @submit="handleCreateTemplate"
    />
  </BaseSidebar>
</template>
