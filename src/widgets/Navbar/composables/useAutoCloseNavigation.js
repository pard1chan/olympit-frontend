// composables/useAutoCloseDialog.js
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export function useAutoCloseNavigation(dialogControl) {
  const route = useRoute()
  
  // Watch for route changes and close dialog
  watch(
    () => route.fullPath,
    () => {
      if (dialogControl.isOpen?.value || dialogControl.isOpen) {
        dialogControl.close?.()
      }
    }
  )
  
  // Function to wrap navigation with auto-close
  const navigateWithClose = (to, router) => {
    if (dialogControl.isOpen?.value || dialogControl.isOpen) {
      dialogControl.close?.()
    }
    
    if (typeof to === 'string') {
      window.location.href = to
    } else {
      router.push(to)
    }
  }
  
  return {
    navigateWithClose
  }
}