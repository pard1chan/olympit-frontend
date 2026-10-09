// shared/lib/composables/useMessagesPagination.js
import { ref } from 'vue'

export function useMessagesPagination(options = {}) {
  const {
    pageSize = 20,
    initialPage = 1
  } = options

  // Состояние
  const messages = ref([])
  const currentPage = ref(initialPage)
  const hasMore = ref(true)
  const isLoading = ref(false)
  
  // Для сохранения позиции скролла
  const prevScrollHeight = ref(0)
  const containerRef = ref(null)

  // Загрузка первой страницы
  const loadFirstPage = async (fetchFn) => {
    isLoading.value = true
    
    try {
      const result = await fetchFn(1, pageSize)
      
      if (result?.messages) {
        messages.value = result.messages
        currentPage.value = 1
        hasMore.value = result.hasMore ?? result.messages.length === pageSize
      }
      
      return result
    } finally {
      isLoading.value = false
    }
  }

  // Загрузка следующей страницы (старые сообщения)
  const loadNextPage = async (fetchFn) => {
    if (isLoading.value || !hasMore.value) return
    
    isLoading.value = true
    
    // Сохраняем высоту для восстановления скролла
    if (containerRef.value) {
      prevScrollHeight.value = containerRef.value.scrollHeight
    }
    
    try {
      const nextPage = currentPage.value + 1
      const result = await fetchFn(nextPage, pageSize)
      
      if (result?.messages?.length) {
        // Добавляем старые сообщения в начало
        messages.value = [...result.messages, ...messages.value]
        currentPage.value = nextPage
        hasMore.value = result.hasMore ?? result.messages.length === pageSize
      } else {
        hasMore.value = false
      }
      
      return result
    } finally {
      isLoading.value = false
    }
  }

  // Восстановление позиции скролла
  const restoreScrollPosition = () => {
    if (!containerRef.value || !prevScrollHeight.value) return
    
    const newHeight = containerRef.value.scrollHeight
    const diff = newHeight - prevScrollHeight.value
    containerRef.value.scrollTop = diff + 20
    
    prevScrollHeight.value = 0
  }

  // Добавление нового сообщения
  const addMessage = (message) => {
    messages.value = [...messages.value, message]
  }

  // Сброс
  const reset = () => {
    messages.value = []
    currentPage.value = initialPage
    hasMore.value = true
    isLoading.value = false
    prevScrollHeight.value = 0
  }

  // Проверка нужно ли загрузить еще
  const shouldLoadMore = (scrollTop) => {
    return scrollTop < 50 && !isLoading.value && hasMore.value
  }

  return {
    // Состояние
    messages,
    currentPage,
    hasMore,
    isLoading,
    containerRef,
    
    // Методы
    loadFirstPage,
    loadNextPage,
    restoreScrollPosition,
    addMessage,
    shouldLoadMore,
    reset
  }
}