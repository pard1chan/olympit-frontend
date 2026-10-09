<template>
  <li @click="emit('markAsRead')" class="item" :class="{
    'readed': notification.read
  }">
    <div class="item__date h6">{{ date }}</div>
    <div class="item__content">
      <div class="item__title h3">{{ notification.title }}</div>
      <div class="item__message">{{ notification.message }}</div>
    </div>
    <div v-if="notification.read" class="item__readed h6">
      {{ notification.read ? 'Прочитано' : null }}
    </div>
  </li>
</template>

<script setup>
import { formatDate } from '@/shared/lib/formatters/formatDate';
import { computed } from 'vue';

const props = defineProps({
  notification: Object
})

const emit = defineEmits(['markAsRead'])

const date = computed(() => formatDate(props.notification.createdAt))
</script>

<style scoped lang="scss">
.item {
  position: relative;
  display: flex;
  row-gap: 10px;
  flex-direction: column;
  padding: 8px 15px;
  border-radius: var(--border-radius-s);
  cursor: pointer;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition-duration: var(--transition-duration);

  &__readed {
    position: absolute;
    right: 15px;
  }

  @include hover {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
    transform: translateY(-2px);
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }
}


.readed {
  background-color: #f3f0f06b;
}
</style>