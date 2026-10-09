<script setup>
import { Card } from '@/shared/ui';
import { useProfile } from '@/widgets/UserProfileCard/useUser';
import { onMounted } from 'vue';

const { user, fetchUser, avatar } = useProfile()


onMounted(fetchUser)
</script>

<template>
  <Card>
    <div class="user-profile-card">
      <!-- <div class="user-profile-card__header">
        <h2 class="user-profile-card__title">Место в рейтинге</h2>
        <div class="user-profile-card__place h2">444</div>
      </div> -->
      <div class="user-profile-card__body">
        <img :src="avatar" alt="" class="user-profile-card__img">
        <div class="user-profile-card__content">
          <div class="user-profile-card__name">{{ user?.nickname }}</div>
          <!-- <div class="user-profile-card__subjects h6">test</div> -->
        </div>
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.user-profile-card {
  display: flex;
  flex-direction: column;
  row-gap: fluid(40, 20);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__body {
    display: flex;
    align-items: center;
    column-gap: 20px;
  }

  &__name {
    @include fluid-text(20, 16);
  }

  &__img {
    @include square(72px);
    border-radius: 50%;
  }
}
</style>