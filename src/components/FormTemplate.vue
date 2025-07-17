<script setup lang="ts">
import { reactive } from 'vue'
import { useApi } from '@/composables/useApi'
import { type CreateTemplateParams } from '@/api/types'
import BaseLabel from '@/components/BaseLabel.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const { loading: createTemplateLoading, error: createTemplateError, createTemplate } = useApi()

const formData = reactive<CreateTemplateParams>({
  name: '',
  width: '1024px',
  height: '1024px',
  objects: null,
})

const handleCreateTemplate = async () => {
  // createTemplateError.value = ''
  const response = await createTemplate(formData)

  if (response && !createTemplateError.value) {
    console.log('success')
  } else {
    // authErrorMessage.value = 'Login failed. Please try again'

    if (createTemplateError.value?.response) {
      const { status } = createTemplateError.value.response
      if (status === 401 || status === 403) {
        // authErrorMessage.value = 'Invalid username or password. Please try again.'
        console.log('error', 401, 403)
      } else if (status === 503) {
        // authErrorMessage.value = 'Server unavailable. Please try again later.'
        console.log('error', 503)
      }
    } else if (createTemplateError.value?.request) {
      console.log('other error')
      // authErrorMessage.value = 'Network error. Please check your connection.'
    }

    console.error('Create template error:', createTemplateError.value)
  }
}

const handleSubmit = () => {
  // const isValid = validateForm({
  //   email: { value: formData.value.email, rules: emailRules },
  //   password: { value: formData.value.password, rules: passwordRules },
  // })

  // if (isValid) handleCreateTemplate()
  handleCreateTemplate()
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
        />
      </div>
      <div>{{ formData.name }}</div>
      <div class="relative">
        <BaseButton class="btn-primary" type="submit">Create</BaseButton>
      </div>
    </fieldset>
  </form>
</template>
