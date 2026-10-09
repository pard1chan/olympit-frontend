<script setup>
import { Container } from '@/shared/ui';
import UserProfileCard from '@/widgets/UserProfileCard';
import { useAuthStore } from '@/shared/stores';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { userType } = storeToRefs(authStore)
</script>

<template>
  <Container>
    <div class="profile-edit">
      <UserProfileCard type="edit" :user-type="userType" />
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.profile-edit {
  width: 100%;

  @include tablet-above {
    max-width: 50%;
  }
}
</style>