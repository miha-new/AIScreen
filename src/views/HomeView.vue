<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTemplateStore } from '@/stores/templates'
import { useApi } from '@/composables/useApi'
import type { TemplateTag, TemplatesParams, CreateTemplateParams } from '@/api/types'
import BaseButton from '@/components/BaseButton.vue'
import BaseSidebar from '@/components/BaseSidebar.vue'
import FormTemplate from '@/components/FormTemplate.vue'
import BaseSearch from '@/components/BaseSearch.vue'
import BaseTag from '@/components/BaseTag.vue'
import CardTemplate from '@/components/CardTemplate.vue'

const store = useTemplateStore()

const { templateTags, templates, hasTemplateTags, hasTemplates } = storeToRefs(store)

const { setTemplateTags, setTemplates, addTemplate, removeTemplateById } = store

const { loading: createTemplateLoading, error: createTemplateError, createTemplate } = useApi()
const { getTemplates, loading: templatesLoading, error: templatesError } = useApi()
const { getTemplateTags, error: templatesTagsError } = useApi()
const { error: deleteTemplateError, deleteTemplate } = useApi()

const isPanelOpen = ref(false)
const createErrorMessage = ref<string>('')
const search = ref('')
const activeTemplatesTags = ref<TemplateTag[]>([])
const templatesParams = computed<TemplatesParams>(() => {
  return { filter: { name: search.value, tags: activeTemplatesTags.value } }
})

const handleTemplates = async (params?: TemplatesParams) => {
  const response = await getTemplates(params)

  if (response && !templatesError.value) {
    setTemplates(response)
  }
}

const handleSearch = () => {
  handleTemplates(templatesParams.value)
}

const isActiveTemplatesTags = (value: TemplateTag) => {
  return activeTemplatesTags.value.indexOf(value) !== -1
}

const handleActiveTemplatesTags = (value: TemplateTag) => {
  const index: number = activeTemplatesTags.value.indexOf(value)

  if (index === -1) {
    activeTemplatesTags.value.splice(activeTemplatesTags.value.length, 0, value)
  } else {
    activeTemplatesTags.value.splice(index, 1)
  }

  handleTemplates(templatesParams.value)
}

const handleTemplateTags = async () => {
  const response = await getTemplateTags()

  if (response && !templatesTagsError.value) {
    setTemplateTags(response)
  }
}

const handleDeleteTemplate = async (id: number) => {
  await deleteTemplate({ id })

  if (!deleteTemplateError.value) {
    removeTemplateById(id)
  }
}

const handleCreateTemplate = async (params: CreateTemplateParams, clearForm: () => void) => {
  createErrorMessage.value = ''

  const response = await createTemplate(params)

  if (response && !createTemplateError.value) {
    clearForm()
    addTemplate(response)
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

onMounted(() => {
  handleTemplateTags()
  handleTemplates()
})
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <div class="flex-1">
      <h2 class="h1">Templates</h2>
    </div>
    <div class="flex-shrink-0">
      <BaseButton class="btn-primary" @click="isPanelOpen = true">Create template</BaseButton>
    </div>
  </div>
  <div class="mb-4">
    <BaseSearch class="mb-3" v-model="search" @search="handleSearch" />
    <div v-if="hasTemplateTags" class="flex gap-1">
      <BaseTag
        v-for="(templateTagItem, index) in templateTags"
        :key="index"
        class="tag-primary"
        as="button"
        :clickable="true"
        :active="isActiveTemplatesTags(templateTagItem)"
        @keyup.enter="handleActiveTemplatesTags(templateTagItem)"
        @click="handleActiveTemplatesTags(templateTagItem)"
      >
        {{ templateTagItem }}
      </BaseTag>
    </div>
  </div>

  <div
    v-if="hasTemplates"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
  >
    <CardTemplate
      v-for="templateItem in templates"
      :key="templateItem.id"
      :template="templateItem"
      @delete="handleDeleteTemplate"
    />
  </div>
  <div v-else-if="templatesLoading" class="text-lg font-bold py-10">
    <div class="loader mx-auto" />
  </div>
  <div v-else class="text-lg font-bold text-center py-10">No Templates Available</div>

  <BaseSidebar :isOpen="isPanelOpen" title="Create Template" @close="isPanelOpen = false">
    <!-- <FormTemplate
      :tags="templateTags"
      :error="createErrorMessage"
      :loading="createTemplateLoading"
      @submit="handleCreateTemplate"
    /> -->
    <FormTemplate
      :tags="templateTags"
      :error="createErrorMessage"
      :loading="createTemplateLoading"
      @submit="handleCreateTemplate"
    />
  </BaseSidebar>
</template>
