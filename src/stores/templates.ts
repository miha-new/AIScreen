import { defineStore } from 'pinia'
import type { TemplateDraft, Template, TemplateTag } from '@/api/types'

export const useTemplateStore = defineStore('templates', {
  state: () => ({
    templateDraft: {} as TemplateDraft,
    templateTags: [] as TemplateTag[],
    templates: [] as Template[],
    template: {} as Template,
  }),
  actions: {
    setTemplateDraft(data: TemplateDraft) {
      this.templateDraft = data

      localStorage.setItem('template_draft', JSON.stringify(data))
    },
    setTemplate(item: Template) {
      this.template = item
    },
    loadTemplateDraftFromLS() {
      const items = localStorage.getItem('template_draft')
      if (items) {
        this.templateDraft = JSON.parse(items)
      }
    },
    setTemplateTags(items: TemplateTag[]) {
      this.templateTags = items
    },
    setTemplates(items: Template[]) {
      this.templates = items
    },
    addTemplate(template: Template) {
      this.templates.push(template)
    },
    removeTemplateById(id: number) {
      const index = this.templates.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.templates.splice(index, 1)
      }
      return index !== -1
    },
  },
  getters: {
    hasTemplateTags: (state) => state.templateTags.length > 0,
    hasTemplates: (state) => state.templates.length > 0,
  },
})
