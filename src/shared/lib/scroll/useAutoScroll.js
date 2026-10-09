// shared/lib/scroll/useAutoScroll.js
import { ref, nextTick } from 'vue';

export function useAutoScroll() {
  const containerRef = ref(null);
  
  const scrollToBottom = async (behavior = 'smooth') => {
    // Ждем следующий тик для гарантии рендера
    await nextTick();
    
    if (!containerRef.value) {
      console.warn('containerRef не привязан к элементу');
      return;
    }
    
    try {
      const container = containerRef.value;
      
      // Проверяем, есть ли контент для скролла
      if (container.scrollHeight > container.clientHeight) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: behavior
        });
        
      }
    } catch (error) {
      console.error('Ошибка при скролле:', error);
    }
  };
  
  const scrollToBottomSmooth = () => {
    scrollToBottom('smooth');
  };
  
  const scrollToBottomInstant = () => {
    if (!containerRef.value) return;
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  };
  
  const scrollToElement = (elementId, behavior = 'smooth') => {
    if (!containerRef.value) return;
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block: 'end' });
    }
  };
  
  return {
    containerRef,
    scrollToBottom,
    scrollToBottomSmooth,
    scrollToBottomInstant,
    scrollToElement
  };
}