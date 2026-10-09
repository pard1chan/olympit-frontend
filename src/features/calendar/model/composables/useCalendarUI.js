// features/calendar/model/composables/useCalendarUI.js
import { ref, computed } from 'vue'

/**
 * Composable for managing calendar UI state and dialog
 */
export function useCalendarUI() {
  // Dialog state
  const dialogRef = ref(null)
  const isDialogOpen = ref(false)
  
  // Selected day & events
  const selectedDay = ref(null)
  const selectedEvents = ref([])

  /**
   * Open dialog with day's events
   */
  const openEventDialog = (day, events) => {
    if (events && events.length > 0) {
      selectedDay.value = day
      selectedEvents.value = events
      
      if (dialogRef.value?.open) {
        dialogRef.value.open()
        isDialogOpen.value = true
      } else {
        console.error('Dialog ref not found')
      }
    }
  }

  /**
   * Close dialog and reset state
   */
  const closeEventDialog = () => {
    selectedDay.value = null
    selectedEvents.value = []
    isDialogOpen.value = false
    
    if (dialogRef.value?.close) {
      dialogRef.value.close()
    }
  }

  /**
   * Check if dialog should be open
   */
  const hasSelectedEvents = computed(() => selectedEvents.value.length > 0)

  /**
   * Get dialog title based on selected day
   */
  const dialogTitle = computed(() => {
    if (!selectedDay.value) return 'События'
    
    return `События на ${selectedDay.value.day} ${selectedDay.value.monthName}`
  })

  /**
   * Reset all UI state
   */
  const resetUIState = () => {
    selectedDay.value = null
    selectedEvents.value = []
    isDialogOpen.value = false
  }

  return {
    // Refs
    dialogRef,
    selectedDay,
    selectedEvents,
    isDialogOpen,
    
    // Computed
    hasSelectedEvents,
    dialogTitle,
    
    // Methods
    openEventDialog,
    closeEventDialog,
    resetUIState
  }
}