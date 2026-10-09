<!-- features/calendar/ui/CalendarDay.vue -->
<template>
  <div @click="onClick" class="calendar__day" :class="dayClasses" :title="dayTooltip">
    {{ day.day }}
    <span v-if="day.hasEvents" class="calendar__day-events">
      {{ day.events.length }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['day-click'])

const dayClasses = computed(() => ({
  'is-today': props.day.isToday,
  'has-events': props.day.hasEvents,
  'is-current-month': props.day.isCurrentMonth,
  'is-padding': props.day.isPadding
}))

const dayTooltip = computed(() => {
  if (props.day.isPadding) return ''
  if (!props.day.hasEvents) return `Нет событий на ${props.day.day} число`

  const eventTitles = props.day.events
    .slice(0, 3)
    .map(e => e.title)
    .join(', ')

  const more = props.day.events.length > 3
    ? ` и ещё ${props.day.events.length - 3}...`
    : ''

  return `События: ${eventTitles}${more}`
})

const onClick = () => {
  if (!props.day.isPadding && props.day.hasEvents) {
    emit('day-click', props.day)
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
/* Your existing styles with enhancements */
.calendar__day {
  @include square (fluid(42, 30));
  @include flex-center;
  @include fluid-text(17, 14);

  border: 1px solid color.adjust(#19182b, $lightness: 66%);
  border-radius: 30px;
  cursor: pointer;
  font-weight: 300;
  transition: var(--transition-duration);
  position: relative;

  @include hover {
    border-color: var(--color-pink);
    color: var(--color-pink);
    transform: scale(1.05);
  }

  &.is-today {
    color: var(--color-pink);
    border-color: var(--color-pink);
    font-weight: 600;
  }

  &.has-events {
    border-color: color.adjust(#ffa3c4, $lightness: -25%);
  }

  &.is-padding {
    opacity: 0.4;
    cursor: default;

    @include hover {
      border-color: var(--color-primary);
      color: inherit;
      transform: none;
    }
  }

  &:not(.has-events):not(.is-today):not(.is-padding) {
    cursor: pointer;
  }
}

.calendar__day-events {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ffa3c4;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>