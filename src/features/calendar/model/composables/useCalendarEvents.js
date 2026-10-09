// features/calendar/model/composables/useCalendarEvents.js
import { computed } from "vue";

/**
 * Composable for filtering and managing calendar events
 */
export function useCalendarEvents(publicEvents, currentMonth) {
  /**
   * Filter events for the current month
   */
  const currentMonthEvents = computed(() => {
    if (!publicEvents.value || !currentMonth.value) return [];

    return publicEvents.value.filter((event) => {
      const eventDate = getEventDate(event);
      return (
        eventDate.getMonth() === currentMonth.value.monthIndex &&
        eventDate.getFullYear() === currentMonth.value.year
      );
    });
  });

  /**
   * Get events for a specific day
   */
  const getEventsForDay = (day) => {
    if (!publicEvents.value || !day || day.isPadding) return [];

    return publicEvents.value.filter((event) => {
      const eventDate = getEventDate(event);

      // Convert month to JavaScript format (0-11)
      // day.month might be 1-12, so subtract 1
      const dayMonthIndex =
        day.monthIndex !== undefined ? day.monthIndex : day.month - 1;

      return (
        eventDate.getDate() === day.day &&
        eventDate.getMonth() === dayMonthIndex &&
        eventDate.getFullYear() === day.year
      );
    });
  };

  /**
   * Get events for multiple days
   */
  const getEventsForDays = (days) => {
    return days.reduce((acc, day) => {
      if (!day.isPadding) {
        acc[day.date.getTime()] = getEventsForDay(day);
      }
      return acc;
    }, {});
  };

  /**
   * Check if a day has events
   */
  const hasEventsForDay = (day) => {
    return getEventsForDay(day).length > 0;
  };

  /**
   * Extract date from event object
   */
  const getEventDate = (event) => {
    // Try different possible date fields in order of priority
    return new Date(event.startsAt);
  };

  const isEventInMonth = (event, month) => {
    if (!month) return false;

    const eventDate = getEventDate(event);
    return (
      eventDate.getMonth() === month.monthIndex &&
      eventDate.getFullYear() === month.year
    );
  };

  /**
   * Check if event is on a specific day
   */
  const isEventOnDay = (event, day) => {
    if (!day || day.isPadding) return false;

    const eventDate = getEventDate(event);
    return (
      eventDate.getDate() === day.day &&
      eventDate.getMonth() === day.monthIndex &&
      eventDate.getFullYear() === day.year
    );
  };

  /**
   * Format event time for display
   */
  const formatEventTime = (event) => {
    if (!event.startsAt) return "";

    const start = new Date(event.startsAt);
    const end = event.endsAt ? new Date(event.endsAt) : null;

    let timeStr = start.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (end) {
      timeStr +=
        " - " +
        end.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });
    }

    return timeStr;
  };

  /**
   * Group events by day for the current month
   */
  const eventsByDay = computed(() => {
    const eventsMap = {};

    currentMonthEvents.value.forEach((event) => {
      const eventDate = getEventDate(event);
      const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}-${eventDate.getDate()}`;

      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }

      eventsMap[dateKey].push({
        ...event,
        formattedTime: formatEventTime(event),
      });
    });

    return eventsMap;
  });

  return {
    currentMonthEvents,
    getEventsForDay,
    getEventsForDays,
    hasEventsForDay,
    formatEventTime,
    eventsByDay,
  };
}
