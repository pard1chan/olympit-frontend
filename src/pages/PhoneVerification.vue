<script setup>
import { useAuthStore } from '@/shared/stores';
import { AuthCard, Button, Field } from '@/shared/ui';
import { ph } from '@/widgets/AuthForm/lib/validation/schemas';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()

const router = useRouter()

const { values, errors } = useForm({
  validationSchema: ph
})
const { value: phoneValue } = useField('phone')


const send = async () => {
  // await authStore.sendPhoneCode({
  //   phone: phoneValue.value
  // })
  router.push({ name: 'auth', params: { type: 'register' } })
}
const mask = ref('+{7} (000) 000-00-00')
</script>

<template>
  <div class="role-selection">
    <AuthCard class="phone-ver" title="Введите номер телефона">
      <form class="phone-ver" @submit.prevent="send">
        <Field :mask="mask" type="tel" placeholder="+(7) (000) 000-00-00" name="phone" />
        <Button :disabled="Object.keys(errors).length !== 0 || !phoneValue" label="Далее" full />
      </form>
    </AuthCard>
  </div>
</template>

<style lang="scss" scoped>
.role-selection {
  display: grid;
  height: 100dvh;
  place-items: center;


  &__btns {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 22px;
  }
}

.phone-ver {
  display: grid;
  row-gap: 20px;
}
</style>