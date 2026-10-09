<!-- features/calendar/ui/EventItem.vue -->
<template>
  <div class="event-item" :style="{ borderLeftColor: event.color || '#4f46e5' }">
    <div class="event-item__header">
      <h3 class="event-item__title">{{ event.title }}</h3>
      <span v-if="eventTime" class="event-item__time">
        {{ eventTime }}
      </span>
    </div>
    
    <p v-if="event.type" class="event-item__description">
      {{ TYPES[event.type] }}
    </p>
  </div>
</template>

<script setup>
import { TYPES } from '@/pages/Teacher/Events/constants'
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const eventTime = computed(() => {
  if (!props.event.startsAt) return ''
  
  // Parse as UTC
  const start = new Date(props.event.startsAt)
  const end = props.event.endsAt ? new Date(props.event.endsAt) : null
  
  // Use UTC methods
  const startHours = start.getUTCHours().toString().padStart(2, '0')
  const startMinutes = start.getUTCMinutes().toString().padStart(2, '0')
  
  let timeStr = `${startHours}:${startMinutes}`
  
  if (end) {
    const endHours = end.getUTCHours().toString().padStart(2, '0')
    const endMinutes = end.getUTCMinutes().toString().padStart(2, '0')
    timeStr += ` - ${endHours}:${endMinutes}`
  }
  
  return timeStr
})
</script>

<style lang="scss" scoped>
.event-item {
  display: flex;
  flex-direction: column;
  align-items: start;
  row-gap: 15px;
  
  &__header {
    display: flex;
    flex-direction:  column;
    row-gap: 15px;
    align-items: start;
  }
  
  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  &__time {
    font-size: 0.85rem;
    color: #6b7280;
    background-color: #e5e7eb;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }
  

}
</style>