// features/calendar/model/composables/useCalendar.js
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useCalendarStore } from "../store/useCalendarStore";
import { useMonthDays } from "@/shared/lib/composables/useMonthDays";
import { useCalendarEvents } from "./useCalendarEvents";
import { useCalendarUI } from "./useCalendarUI";
import { useWeekDays } from "./useWeekDays";

export function useCalendar() {
  // 1. Store integration
  const calendarStore = useCalendarStore();
  const { publicEvents, ownerEvents, isLoading, error } =
    storeToRefs(calendarStore);

  // 2. Date/month management
  const monthDays = useMonthDays();
  const {
    currentMonth,
    getCalendarDays,
    next: nextMonth,
    prev: prevMonth,
    setBaseDate,
  } = monthDays;

  // 3. Weekday management
  const weekDaysManager = useWeekDays({
    startWeekOnMonday: true,
    shortFormat: true,
    showWeekends: true,
  });

  const {
    weekDays,
    weekDaysWithIndex,
    getWeekdayForDay
  } = weekDaysManager;

  // 4. Events filtering
  const eventsManager = useCalendarEvents(publicEvents, currentMonth);
  const {
    currentMonthEvents,
    getEventsForDay,
    hasEventsForDay,
    formatEventTime,
  } = eventsManager;

  // 5. UI state management
  const uiManager = useCalendarUI();
  const {
    dialogRef,
    selectedDay,
    selectedEvents,
    openEventDialog,
    closeEventDialog,
    dialogTitle,
  } = uiManager;

  // 6. Calendar days WITH CORRECT weekday info
const calendarDays = computed(() => {
  const days = getCalendarDays(0, { startWeekOnMonday: true });

  return days.map((day) => {
    const dateObj = new Date(day.year, day.monthIndex, day.day);

    return {
      ...day,
      date: dateObj,
      events: getEventsForDay(day),
      hasEvents: hasEventsForDay(day),
    };
  });
});

  /**
   * Handle day click
   */
  const handleDayClick = (day) => {
    if (day.events && day.events.length > 0) {
      openEventDialog(day, day.events);
    }
  };

  /**
   * Navigate to specific date
   */
  const goToDate = (date) => {
    setBaseDate(date);
  };

  /**
   * Navigate to today
   */
  const goToToday = () => {
    setBaseDate(new Date());
  };

  return {
    // Store data
    publicEvents,
    ownerEvents,
    isLoading,
    error,

    // Date management
    currentMonth,
    calendarDays,
    next: nextMonth,
    prev: prevMonth,
    goToDate,
    goToToday,

    // Weekday data
    weekDays,
    weekDaysWithIndex,

    // Events
    currentMonthEvents,
    getEventsForDay,
    formatEventTime,

    // UI/Dialog
    dialogRef,
    selectedDay,
    selectedEvents,
    dialogTitle,
    handleDayClick,
    closeEventDialog,

    // Actions
    fetchPublicEvents: calendarStore.fetchPublicCalendarEvents,
    fetchOwnersEvents: calendarStore.fetchOwnerCalendarEvents,
  };
}