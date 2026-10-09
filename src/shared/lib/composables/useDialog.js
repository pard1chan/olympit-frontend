// shared/lib/composables/useDialog.js - FIXED REACTIVITY
import { ref, watch, onUnmounted, toRef } from 'vue'

export function useDialog(options = {}) {
  const {
    lockScroll = true,
    closeOnEsc = true,
    closeOnOutsideClick = true,
    onOpen = null,
    onClose = null
  } = options

  const dialogRef = ref()
  const isOpen = ref(false)
  
  // Sync dialog's native open attribute with our reactive state
  watch(() => dialogRef.value?.isOpen, (newVal) => {
    if (newVal !== undefined && newVal !== isOpen.value) {
      console.log('Syncing dialog open attribute:', newVal)
      isOpen.value = newVal
    }
  }, { immediate: true })

  // Handle escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape' && closeOnEsc) {
      close()
    }
  }

  // Handle outside click for dialog
  const handleOutsideClick = (event) => {
    if (dialogRef.value && closeOnOutsideClick && isOpen.value) {
      const rect = dialogRef.value.getBoundingClientRect()
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      )
      
      if (!isInDialog) {
        close()
      }
    }
  }

  const open = () => {
    if (!dialogRef.value) {
      console.warn('Dialog ref not available')
      return
    }
    
    dialogRef.value.showModal?.()
    isOpen.value = true
    
    if (lockScroll) {
      document.documentElement.classList.add('is-lock')
    }
    
    if (closeOnEsc) {
      document.addEventListener('keydown', handleEscape)
    }
    
    if (closeOnOutsideClick) {
      // Small delay to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick)
      }, 100)
    }
    
    onOpen?.()
  }

  const close = () => {
    if (!dialogRef.value) {
      console.warn('Dialog ref not available')
      return
    }
    
    dialogRef.value.close?.()
    isOpen.value = false
    
    if (lockScroll) {
      document.documentElement.classList.remove('is-lock')
    }
    
    document.removeEventListener('keydown', handleEscape)
    document.removeEventListener('click', handleOutsideClick)
    
    onClose?.()
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  // Cleanup
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.removeEventListener('click', handleOutsideClick)
    if (lockScroll) {
      document.documentElement.classList.remove('is-lock')
    }
  })

  return {
    dialogRef,
    isOpen: toRef(isOpen), // Ensure proper reactivity
    open,
    close,
    toggle
  }
}