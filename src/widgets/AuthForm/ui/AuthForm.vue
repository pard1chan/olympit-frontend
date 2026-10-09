<script setup>
import { AuthCard, Button, Field } from '@/shared/ui'
import { useAuthForm } from '../model/composables/useAuthForm'
import { useValidation } from '../model/composables/useValidationSchema'
import { onMounted } from 'vue'

const { config, formType } = useAuthForm()
const {  submit, errors, error, isSubmitting } = useValidation(formType)

onMounted(() => error.value = null)
</script>

<template>
  <AuthCard :title="config.title" :description="config.description">
    <form @submit="submit" class="auth-form">
      <div class="error">{{ error }}</div>
      <Field 
        v-for="fieldItem in config.fields" 
        :key="fieldItem.name" 
        :name="fieldItem.name" 
        :placeholder="fieldItem.placeholder" 
        :type="fieldItem.type" 
        :icon="fieldItem.icon" 
        :mask="fieldItem.mask"
        :autocomplete="fieldItem.name"
        />
      <div v-if="config.links?.length" class="auth-form__links">
        <router-link v-for="link in config.links" :to="link.to" :key="link.to" type="button" class="auth-form__link" :class="link.class">
          {{ link.text }}
        </router-link>
       </div>

       <div class="auth-form_btns">
        <Button 
          v-for="btn in config.btns" 
          class="auth-form__button" 
          :label="isSubmitting ? 'Загрузка...' : btn.submitText" 
          :disabled="!!errors && isSubmitting"
          />
       </div>
    </form>
  </AuthCard>
</template>
<style lang="scss" scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__links {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__link {
    @include hover {
      text-decoration: underline;
    }
  }

  &__button {
    width: 100%;
  }
}
</style>