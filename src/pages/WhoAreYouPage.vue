<script setup>
import { useAuthStore } from '@/shared/stores';
import { AuthCard, Button } from '@/shared/ui';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()

const router = useRouter()

const selectRole = role => {
  authStore.setUserType(role)  
  router.push({ name: 'phone-verification' })
}
</script>

<template>
  <div class="role-selection">
    <AuthCard>
      <div class="role-selection__btns">
        <Button @click="selectRole('student')" label="Я ученик" />
        <Button @click="selectRole('teacher')" label="Я учитель" />
      </div>
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
</style>