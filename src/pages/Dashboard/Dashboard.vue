<template>
  <div class="dashboard container">
    <template v-if="userType !== 'admin'">
      <UserProfileCard :userType class="dashboard__user-card" />
      <NotificationsBlock :userType class="dashboard__notifications" />
      <Calendar :userType class="dashboard__calendar" />
    </template>
    <!-- <Progress v-if="userType === 'student'" class="dashboard__progress" /> -->

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import UserProfileCard from '@/widgets/UserProfileCard';
import NotificationsBlock from '@/features/notifications';
import Calendar from '@/features/calendar';
import Progress from '@/features/progress/ui';
import { useAuthStore } from '@/shared/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()
const { userType } = storeToRefs(authStore)

onMounted(() => {
  if (userType.value === 'admin') {
    router.push({ name: 'admin-panel' })
  }
})

const rows = computed(() => userType === 'student' ? 3 : 2)
</script>

<style lang="scss" scoped>
.dashboard {
  --gridTemplateColumns: 2;

  display: grid;
  grid-template-columns: repeat(var(--gridTemplateColumns), 1fr);
  grid-template-rows: repeat(v-bind('rows'), 1fr);
  gap: 20px;
  grid-template-areas:
    "card calendar"
    "nots calendar"
    "progress progress"
  ;

  @include tablet {
    --gridTemplateColumns: 1;

    grid-template-rows: auto;

    grid-template-areas:
      "card"
      "nots"
      "calendar"
      "progress"
    ;
  }

  &__user-card {
    grid-area: card;
    max-height: 203px;
  }

  &__notifications {
    grid-area: nots;
  }

  &__calendar {
    grid-area: calendar;
  }

  &__progress {
    grid-area: progress;
  }
}
</style>