<script setup>
import { NotificationsItem } from '../NotificationsItem';
import { Empty } from '@/shared/ui';
import { onMounted } from 'vue';
import { useAuthStore } from '@/shared/stores';
import { useNotifications } from '../../model/useNotifications';
import { storeToRefs } from 'pinia';

const props = defineProps({
  limit: { type: Number, default: 2 },
  userType: { default: 'student', type: String }
});

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore)
const { notifications, fetchNotifications, maxHeight } = useNotifications(props.limit);

watch(isAuthenticated, async (newVal) => {
  if (newVal) {
    await fetchNotifications()
  }
}, { immediate: true });
</script>

<template>
  <div class="notifications block">
    <div class="notifications__title h2">Уведомления</div>
    <ul v-if="notifications" class="notifications__list" :style="{ 'max-height': maxHeight }">
      <NotificationsItem
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @markAsRead="markAsRead(notification.id)"
      />
    </ul>
    <Empty v-else-if="authStore.isAuthenticated" text="У вас пока нет уведомлений" />
    <div v-else class="auth-placeholder">
      <p>Войдите, чтобы увидеть уведомления</p>
    </div>
    <router-link
      v-if="userType === 'teacher'"
      class="link"
      :to="{ name: 'notifications' }"
    >
      Создать уведомление
    </router-link>
  </div>
</template>
<style lang="scss" scoped>
.notifications {
  display: grid;
  gap: fluid(15, 10);
  max-height: 288px;
  
  &__title {
    text-align: center;
  }

  &__list {
    padding-top: 5px;
    display: grid;
    row-gap: 10px;
    flex-grow: 1;
    overflow-y: auto;

  }
}

</style>