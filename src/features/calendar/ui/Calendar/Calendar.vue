<script setup>
import { Button, Grid, GridItem } from '@/shared/ui';
import { ArrowLeft, ArrowRight } from '@/shared/ui/Icons';

import Dialog from '@/shared/ui/Dialog/ui/Dialog.vue';
import EventDetailsDialog from '../EventDetailsDialog/EventDetailsDialog.vue';
import CalendarDay from '../CalendarDay';
import { useCalendar } from '../../model/composables/useCalendar';
import { onMounted, watch } from 'vue';
import { useAuthStore } from '@/shared/stores';
import { storeToRefs } from 'pinia';

const props = defineProps({
  userType: {
    default: 'student',
    type: String
  }
})

const {
  // State
  currentMonth,
  calendarDays,
  isLoading,
  error,

  // Static weekday headers
  weekDays,
  weekDaysWithIndex,
  selectedDay,
  selectedEvents,

  // Actions
  fetchPublicEvents,
  fetchOwnersEvents,
  next,
  prev,
  handleDayClick,
  closeEventDialog,

  // Refs
  dialogRef
} = useCalendar()

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)


watch(isAuthenticated, async (newVal) => {
  if (newVal) {
    if (props.userType === 'student') {
      await fetchPublicEvents()
    }
    else {
      await fetchOwnersEvents()
    }
  }
}, { immediate: true });
</script>

<template>
  <div class="calendar block">
    <!-- Header -->
    <div class="calendar__title h2">Календарь</div>

    <!-- Month Navigation -->
    <div class="calendar__actions">
      <Button @click="prev" :icon="ArrowLeft" mode="icon" />
      <div class="h6">{{ currentMonth.monthName }} {{ currentMonth.year }}</div>
      <Button @click="next" :icon="ArrowRight" mode="icon" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="calendar__loading">
      Загрузка событий...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="calendar__error">
      Ошибка загрузки: {{ error }}
    </div>

    <!-- Calendar Grid -->
    <div v-else class="calendar__grid-wrapper">
      <!-- STATIC Days of the week header - NEVER CHANGES -->
      <div class="calendar__weekdays">
        <div v-for="weekday in weekDaysWithIndex" :key="weekday.index" class="calendar__weekday"
          :class="{ 'calendar__weekday--weekend': weekday.isWeekend }">
          {{ weekday.name }}
        </div>
      </div>

      <!-- Calendar days grid - Dates move under static headers -->
      <Grid :columns="7" :rows="6" :gap="20" :tablet-columns="7" :tablet-breakpoint="1024" :mobile-columns="7">
        <GridItem v-for="day in calendarDays" :key="`${day.year}-${day.month}-${day.day}`"
          :class="['w-30', { 'calendar__day-item--padding': day.isPadding }]">
          <CalendarDay :day="day" @day-click="handleDayClick" />
        </GridItem>
      </Grid>
    </div>

    <!-- Events Dialog -->
    <Dialog ref="dialogRef">
      <EventDetailsDialog v-if="selectedDay" :day="selectedDay" :events="selectedEvents" @click="closeEventDialog" />
    </Dialog>

    <router-link v-if="userType !== 'student'" :to="{ name: 'calendar-events-create' }" class="link">Создать
      событие</router-link>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  text-align: center;
  max-height: 600px;

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__grid-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 15px;
    margin-bottom: 8px;
  }

  &__weekday {
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    text-transform: uppercase;
    padding: 8px 0;

    &--weekend {
      color: #ef4444;
    }

    @include mobile {
      font-size: 12px;
      padding: 6px 0;
    }
  }

  &__day-item {
    &--padding {
      opacity: 0.4;
      pointer-events: none;
    }
  }

  &__loading,
  &__error {
    padding: 40px;
    text-align: center;
    color: #6b7280;
  }

  &__error {
    color: #ef4444;
  }
}

.link {
  color: var(--color-pink);
  font-weight: 700;
  align-self: center;
}
</style>