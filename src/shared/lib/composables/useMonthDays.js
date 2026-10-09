// src/shared/lib/date/useMonthDays.js
import { ref, computed } from "vue";

/**
 * Composable for getting days in current and next months
 * @param {Object} options - Configuration options
 * @param {Date|string} options.startDate - Starting date (defaults to current date)
 * @param {number} options.monthsCount - Number of months to calculate (default: 12)
 * @returns {Object} Days information and helper functions
 */
export function useMonthDays(options = {}) {
  const { startDate = new Date(), monthsCount = 12 } = options;

  // Convert to Date object if string provided
  const baseDate = ref(new Date(startDate));

  // Array of month information
  const months = computed(() => {
    const result = [];

    for (let i = 0; i < monthsCount; i++) {
      const currentDate = new Date(
        baseDate.value.getFullYear(),
        baseDate.value.getMonth() + i,
        1,
      );

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-11
      const monthName = getMonthName(month);
      const daysInMonth = getDaysInMonth(year, month);

      result.push({
        year,
        month: month + 1, // 1-12 for display
        monthIndex: month, // 0-11 for calculations
        monthName,
        monthNameShort: monthName.slice(0, 3),
        daysInMonth,
        startDate: currentDate,
        endDate: new Date(year, month, daysInMonth),
        // Weekday of the first day (0 = Sunday, 1 = Monday, etc.)
        firstDayOfWeek: currentDate.getDay(),
        // Weekday of the last day
        lastDayOfWeek: new Date(year, month, daysInMonth).getDay(),
      });
    }

    return result;
  });

  // Current month info
  const currentMonth = computed(() => months.value[0]);

  // Next month info
  const nextMonth = computed(() => months.value[1]);

  // Get specific month by offset (0 = current, 1 = next, etc.)
  const getMonthByOffset = (offset) => {
    if (offset < 0 || offset >= months.value.length) {
      return null;
    }
    return months.value[offset];
  };

  // Get month by year and month (1-12)
  const getMonth = (year, month) => {
    return (
      months.value.find((m) => m.year === year && m.month === month) || null
    );
  };

  // Check if date is within a specific month
  const isDateInMonth = (date, monthIndex = 0) => {
    const targetMonth = months.value[monthIndex];
    if (!targetMonth) return false;

    const checkDate = new Date(date);
    return (
      checkDate.getFullYear() === targetMonth.year &&
      checkDate.getMonth() === targetMonth.monthIndex
    );
  };

  // Get days array for calendar display (including padding days)
const getCalendarDays = (monthOffset = 0, options = {}) => {
  const { startWeekOnMonday = true, includePaddingDays = true } = options;

  const days = [];

  // Текущий месяц от baseDate
  const current = new Date(
    baseDate.value.getFullYear(),
    baseDate.value.getMonth() + monthOffset,
    1
  );

  const year = current.getFullYear();
  const monthIndex = current.getMonth();

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // 🔥 Первый день месяца (0 = Sunday)
  let firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

  if (startWeekOnMonday) {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }

  // ===== PREVIOUS MONTH PADDING =====
  if (includePaddingDays && firstDayOfWeek > 0) {
    const prevMonthDate = new Date(year, monthIndex, 0);
    const prevMonthDays = prevMonthDate.getDate();
    const prevMonthIndex = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;

      days.push({
        day,
        month: prevMonthIndex + 1,
        year: prevYear,
        monthIndex: prevMonthIndex,
        isCurrentMonth: false,
        isPadding: true,
        date: new Date(prevYear, prevMonthIndex, day),
      });
    }
  }

  // ===== CURRENT MONTH =====
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);

    days.push({
      day,
      month: monthIndex + 1,
      year,
      monthIndex,
      isCurrentMonth: true,
      isPadding: false,
      date,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
    });
  }

  // ===== NEXT MONTH PADDING =====
  if (includePaddingDays) {
    const totalCells = Math.ceil(days.length / 7) * 7;
    const paddingNeeded = totalCells - days.length;

    const nextMonthDate = new Date(year, monthIndex + 1, 1);
    const nextMonthIndex = nextMonthDate.getMonth();
    const nextYear = nextMonthDate.getFullYear();

    for (let day = 1; day <= paddingNeeded; day++) {
      days.push({
        day,
        month: nextMonthIndex + 1,
        year: nextYear,
        monthIndex: nextMonthIndex,
        isCurrentMonth: false,
        isPadding: true,
        date: new Date(nextYear, nextMonthIndex, day),
      });
    }
  }

  return days;
};


  // Helper: Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  // Helper: Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Change base date
  const setBaseDate = (date) => {
    baseDate.value = new Date(date);
  };

  // Move to next month
  const next = () => {
    baseDate.value = new Date(
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() + 1,
      1,
    );
  };

  // Move to previous month
  const prev = () => {
    baseDate.value = new Date(
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() - 1,
      1,
    );
  };

  // Reset to current month
  const reset = () => {
    baseDate.value = new Date();
  };

  return {
    // Reactive state
    baseDate,
    months,
    currentMonth,
    nextMonth,

    // Helper methods
    getMonthByOffset,
    getMonth,
    getCalendarDays,
    isDateInMonth,
    isWeekend,
    isToday,

    // Navigation
    setBaseDate,
    next,
    prev,
    reset,
  };
}

// Helper function: Get days in month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper function: Get month name in Russian
function getMonthName(monthIndex) {
  const monthsRu = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  return monthsRu[monthIndex];
}
