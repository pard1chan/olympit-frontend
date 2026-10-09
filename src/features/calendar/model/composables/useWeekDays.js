// features/calendar/model/composables/useWeekDays.js
import { computed } from 'vue'

/**
 * Composable for managing weekday alignment with calendar
 */
export function useWeekDays(options = {}) {
  const {
    startWeekOnMonday = true,
    shortFormat = true,
    showWeekends = true
  } = options

  // Static Russian weekday names
  const WEEK_DAYS = startWeekOnMonday
    ? {
        full: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
        short: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      }
    : {
        full: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        short: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      }

  // Static weekday headers
  const weekDays = computed(() => 
    shortFormat ? WEEK_DAYS.short : WEEK_DAYS.full
  )

  // Weekdays with metadata
  const weekDaysWithIndex = computed(() => 
    weekDays.value.map((name, index) => ({
      name,
      index,
      isWeekend: startWeekOnMonday 
        ? index >= 5 // Saturday and Sunday
        : index === 0 || index === 6 // Sunday and Saturday
    }))
  )

  /**
   * Get weekday for a specific date object
   * This is the CORRECT way - uses actual date
   */
const getWeekdayForDay = (calendarDay) => {
  if (!calendarDay || calendarDay.isPadding) return null
  
  // Use the actual Date object from the day
  const dateObj = calendarDay.date || new Date(calendarDay.year, calendarDay.monthIndex, calendarDay.day)
  const jsDayOfWeek = dateObj.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Convert to calendar column
  let columnIndex
  if (startWeekOnMonday) {
    columnIndex = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1
  } else {
    columnIndex = jsDayOfWeek
  }
  
  return {
    name: weekDays.value[columnIndex],
    index: columnIndex,
    isWeekend: weekDaysWithIndex.value[columnIndex]?.isWeekend || false
  }
}

  return {
    weekDays,
    weekDaysWithIndex,
    getWeekdayForDay,
    WEEK_DAYS
  }
}