// shared/lib/composables/useDialog.js
import { ref, onScopeDispose } from "vue";
import { useClickOutside } from "./useClickOutside";

export function useDialog(options = {}) {
  const {
    lockScroll = true,
    closeOnEsc = true,
    closeOnOutsideClick = true,
    onOpen = null,
    onClose = null,
  } = options;
  
  const dialogRef = ref(null);
  const isOpen = ref(false);

  // Используем useClickOutside для отслеживания кликов снаружи
  const { isClickOutside } = useClickOutside({
    elementRef: dialogRef,
    callback: () => {
      if (closeOnOutsideClick && isOpen.value) {
        close();
      }
    },
    active: isOpen.value && closeOnOutsideClick, // Активируем только когда нужно
  });

  const close = () => {
    if (!isOpen.value) return;
    
    isOpen.value = false;
    
    if (lockScroll) {
      document.documentElement.classList.remove("is-lock");
    }
    
    if (onClose) onClose();
    
    // Удаляем обработчик Escape
    document.removeEventListener('keydown', handleEscape);
  };

  const open = () => {
    if (isOpen.value) return;
    
    isOpen.value = true;
    
    if (lockScroll) {
      document.documentElement.classList.add("is-lock");
    }
    
    if (onOpen) onOpen();
    
    // Добавляем обработчик Escape
    if (closeOnEsc) {
      document.addEventListener('keydown', handleEscape);
    }
  };

  const toggle = () => {
    isOpen.value ? close() : open();
  };

  const handleEscape = (event) => {
    if (event.key === "Escape" && isOpen.value) {
      close();
    }
  };

  // Автоматическая очистка
  onScopeDispose(() => {
    close();
    if (lockScroll) {
      document.documentElement.classList.remove("is-lock");
    }
    document.removeEventListener('keydown', handleEscape);
  });

  return {
    dialogRef,
    isOpen,
    open,
    close,
    toggle,
    isClickOutside, // Можно экспортировать если нужно
  };
}