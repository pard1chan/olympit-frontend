<!-- features/calendar/ui/EventDetailsDialog.vue -->
<template>
  <div class="event-details">
    <div v-if="events.length > 0" class="event-details__list">
      <EventItem v-for="event in events" :key="event.id" :event="event" />
    </div>

    <div v-else class="event-details__empty">
      На этот день событий нет
    </div>
    <Button @click="emit('close')" :icon="IconClose" mode="icon" />

  </div>
</template>

<script setup>
import { Button } from '@/shared/ui';
import { IconClose } from '@/shared/ui/Icons';
import EventItem from '../EventItem/EventItem.vue'

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
.event-details {

  display: flex;
  align-items: start;
  justify-content: space-between;

  &__title {
    margin-bottom: 20px;
    color: #1f2937;
    font-size: 1.5rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;
  }

  &__empty {
    text-align: center;
    padding: 40px 0;
    color: #9ca3af;
    font-style: italic;
  }
}
</style>