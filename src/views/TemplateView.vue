<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import type { Template } from '@/api/types'
import BaseButton from '@/components/BaseButton.vue'
import BaseTag from '@/components/BaseTag.vue'

const route = useRoute()

const { error: templateError, template } = useApi()

const templateDetail = ref<Template | null>(null)

const handleTemplate = async () => {
  const response = await template({ id: Number(route.params.id) })

  if (response && !templateError.value) {
    templateDetail.value = response
  }
}

onMounted(() => {
  handleTemplate()
})
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <div class="flex-1">
      <h2 class="h1">Template</h2>
    </div>
    <div class="flex-shrink-0">
      <BaseButton class="btn-primary">Edit template</BaseButton>
    </div>
  </div>
  <template v-if="templateDetail">
    <div class="card overflow-hidden mb-4">
      <dl class="p-4">
        <dt class="label mb-1">Name:</dt>
        <dd class="text-lg/4.5 font-bold mb-4">{{ templateDetail.name }}</dd>
        <dt class="label mb-1">Tags:</dt>
        <dd class="flex gap-1 mb-4">
          <BaseTag
            v-for="(templateTagItem, index) in templateDetail.tags"
            :key="index"
            class="tag-primary"
          >
            {{ templateTagItem }}
          </BaseTag>
        </dd>
        <dt class="label mb-1">Width:</dt>
        <dd class="text-lg/4.5 font-bold mb-4">{{ templateDetail.width }}</dd>
        <dt class="label mb-1">Height:</dt>
        <dd class="text-lg/4.5 font-bold">{{ templateDetail.height }}</dd>
      </dl>
    </div>
    <div class="card overflow-hidden">
      <img class="w-full h-auto object-cover" :src="templateDetail.preview_image" alt="" />
    </div>
  </template>
</template>
