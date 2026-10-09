import { ref, computed } from 'vue'

export function useFilter(initialFilters = [], options = {}) {
  const {
    multiple = true,
    initialSelected = []
  } = options

  // Состояние фильтров
  const filters = ref(initialFilters)
  const selectedFilters = ref(initialSelected)
  const searchQuery = ref('')

  // Отфильтрованные фильтры (с учетом поиска)
  const filteredFilters = computed(() => {
    if (!searchQuery.value) return filters.value
    
    const query = searchQuery.value.toLowerCase()
    return filters.value.filter(filter => {
      return filter.label.toLowerCase().includes(query) ||
             (filter.description && filter.description.toLowerCase().includes(query))
    })
  })

  // Активные фильтры
  const activeFilters = computed(() => {
    return filters.value.filter(filter => selectedFilters.value.includes(filter.value))
  })

  // Проверка активен ли фильтр
  const isActive = (filterValue) => {
    return selectedFilters.value.includes(filterValue)
  }

  // Переключение фильтра
  const toggleFilter = (filterValue) => {
    if (multiple) {
      // Множественный выбор
      const index = selectedFilters.value.indexOf(filterValue)
      if (index > -1) {
        selectedFilters.value.splice(index, 1)
      } else {
        selectedFilters.value.push(filterValue)
      }
    } else {
      // Одиночный выбор
      if (selectedFilters.value[0] === filterValue) {
        selectedFilters.value = []
      } else {
        selectedFilters.value = [filterValue]
      }
    }
  }

  // Сброс всех фильтров
  const resetFilters = () => {
    selectedFilters.value = []
  }

  // Удалить конкретный фильтр
  const removeFilter = (filterValue) => {
    const index = selectedFilters.value.indexOf(filterValue)
    if (index > -1) {
      selectedFilters.value.splice(index, 1)
    }
  }

  // Получить label по значению
  const getLabel = (filterValue) => {
    const filter = filters.value.find(f => f.value === filterValue)
    return filter ? filter.label : filterValue
  }

  // Получить иконку по значению
  const getIcon = (filterValue) => {
    const filter = filters.value.find(f => f.value === filterValue)
    return filter ? filter.icon : null
  }

  // Обновить список фильтров
  const updateFilters = (newFilters) => {
    filters.value = newFilters
  }

  return {
    // Состояние
    filters,
    selectedFilters,
    searchQuery,
    
    // Вычисляемые свойства
    filteredFilters,
    activeFilters,
    
    // Методы
    isActive,
    toggleFilter,
    resetFilters,
    removeFilter,
    getLabel,
    getIcon,
    updateFilters
  }
}