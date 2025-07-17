<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import type { TemplatesTag, Template, TemplatesParams } from '@/api/types'
import BaseButton from '@/components/BaseButton.vue'
import BaseSearch from '@/components/BaseSearch.vue'
import BaseTag from '@/components/BaseTag.vue'
import CardTemplate from '@/components/CardTemplate.vue'

const templateList = ref<Template[]>([])
const templateTagsList = ref<TemplatesTag[]>([])
const { loading: isTemplatesLoading, error: templatesError, templates } = useApi()
const { error: templatesTagsError, templatesTags } = useApi()

const search = ref('')
const activeTemplatesTags = ref<TemplatesTag[]>([])
const templatesParams = computed<TemplatesParams>(() => {
  return { filter: { name: search.value, tags: activeTemplatesTags.value } }
})

const handleSearch = () => {
  handleTemplates(templatesParams.value)
}

const isActiveTemplatesTags = (value: TemplatesTag) => {
  return activeTemplatesTags.value.indexOf(value) !== -1
}

const handleActiveTemplatesTags = (value: TemplatesTag) => {
  const index: number = activeTemplatesTags.value.indexOf(value)

  if (index === -1) {
    activeTemplatesTags.value.splice(activeTemplatesTags.value.length, 0, value)
  } else {
    activeTemplatesTags.value.splice(index, 1)
  }

  handleTemplates(templatesParams.value)
}

const handleTemplatesTags = async () => {
  const response = await templatesTags()

  if (response && !templatesTagsError.value) {
    templateTagsList.value = response
  }
}

const handleTemplates = async (params?: TemplatesParams) => {
  const response = await templates(params)

  if (response && !templatesError.value) {
    templateList.value = response
  }
}

const handleDeleteTemplate = async () => {
  alert('Delete Template')
}

onMounted(() => {
  handleTemplatesTags()
  handleTemplates()
})
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <div class="flex-1">
      <h2 class="h1">Templates</h2>
    </div>
    <div class="flex-shrink-0">
      <BaseButton class="btn-primary">Create template</BaseButton>
    </div>
  </div>
  <div class="mb-4">
    <BaseSearch class="mb-3" v-model="search" @search="handleSearch" />
    <div v-if="templateTagsList.length" class="flex gap-1">
      <BaseTag
        v-for="(templateTagItem, index) in templateTagsList"
        :key="index"
        class="tag-primary"
        :clickable="true"
        :active="isActiveTemplatesTags(templateTagItem)"
        @keyup.enter="handleActiveTemplatesTags(templateTagItem)"
        @click="handleActiveTemplatesTags(templateTagItem)"
      >
        {{ templateTagItem }}
      </BaseTag>
    </div>
  </div>

  <div v-if="isTemplatesLoading" class="text-lg font-bold py-10">
    <div class="loader mx-auto" />
  </div>
  <template v-else>
    <div
      v-if="templateList.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      <CardTemplate
        v-for="templateItem in templateList"
        :key="templateItem.id"
        :template="templateItem"
        @delete="handleDeleteTemplate"
      />
    </div>
    <div v-else class="text-lg font-bold text-center py-10">No Templates Available</div>
  </template>
</template>
