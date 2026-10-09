// shared/lib/composables/useClickOutside.js
import { onScopeDispose, ref, watch } from "vue";

export function useClickOutside(options = {}) {
  const {
    elementRef,
    callback,
    active = true,
    event = "click",
    capture = false,
  } = options;

  const isClickOutside = ref(false);
  
  // Функция для создания обработчика
  const createListener = () => {
    if (!active || !elementRef?.value) {
      isClickOutside.value = false;
      return null;
    }

    const element = elementRef.value;
    
    const handleClick = (event) => {
      
      if (element && !element.contains(event.target)) {
        isClickOutside.value = true;
        if (callback) callback(event);
      } else {
        isClickOutside.value = false;
      }
    };

    // Добавляем слушатель с небольшой задержкой
    const timeoutId = setTimeout(() => {
      document.addEventListener(event, handleClick, { capture });
    }, 0);

    // Возвращаем функцию очистки
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener(event, handleClick, { capture });
    };
  };

  // Текущая функция очистки
  let cleanup = createListener();

  // Функция обновления слушателя
  const updateListener = () => {
    if (cleanup) {
      cleanup();
    }
    cleanup = createListener();
  };

  // Следим за изменениями
  watch(() => [active, elementRef?.value], updateListener, { immediate: true });

  // Автоматическая очистка при уничтожении компонента
  onScopeDispose(() => {
    if (cleanup) {
      cleanup();
    }
  });

  return {
    isClickOutside,
    updateListener,
  };
}