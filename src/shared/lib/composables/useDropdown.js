// shared/lib/composables/useDropdown.js
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export function useDropdown(options = {}) {
  const {
    items = [],
    modelValue = null,
    multiple = false,
    searchable = false,
    disabled = false,
    loading = false,
    closeOnSelect = true,
    autoClose = true,
    itemValue = 'value',
    itemLabel = 'label',
    itemDisabled = 'disabled',
    itemGroup = 'group',
    groupBy = null,
    placeholder = 'Выберите значение',
    searchPlaceholder = 'Поиск...',
    emptyText = 'Нет данных'
  } = options

  // Рефы
  const triggerRef = ref(null)
  const menuRef = ref(null)
  const searchInputRef = ref(null)
  const itemRefs = ref([])

  // Состояние
  const isOpen = ref(false)
  const searchQuery = ref('')
  const focusedIndex = ref(-1)
  const internalValue = ref(modelValue)

  // Уникальные ID для accessibility
  const componentId = `dropdown-${Math.random().toString(36).substr(2, 9)}`
  const menuId = `${componentId}-menu`
  const triggerId = `${componentId}-trigger`

  // Вспомогательные функции
  const getItemValue = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item[itemValue]
    }
    return item
  }

  const getItemLabel = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item[itemLabel] || String(item[itemValue])
    }
    return String(item)
  }

  const getItemKey = (item, index) => {
    return getItemValue(item) || `item-${index}`
  }

  const isItemSelected = (item) => {
    const itemValue = getItemValue(item)
    if (multiple) {
      return Array.isArray(internalValue.value) 
        ? internalValue.value.includes(itemValue)
        : false
    }
    return internalValue.value === itemValue
  }

  const isItemDisabled = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item[itemDisabled] || false
    }
    return false
  }

  // Вычисляемые значения
  const selectedItem = computed(() => {
    if (multiple) {
      return items.filter(item => {
        const value = getItemValue(item)
        return Array.isArray(internalValue.value) 
          ? internalValue.value.includes(value)
          : false
      })
    } else {
      return items.find(item => getItemValue(item) === internalValue.value)
    }
  })

  const triggerText = computed(() => {
    if (loading) return 'Загрузка...'
    
    if (multiple && Array.isArray(selectedItem.value) && selectedItem.value.length > 0) {
      return selectedItem.value.map(item => getItemLabel(item)).join(', ')
    }
    
    if (!multiple && selectedItem.value) {
      return getItemLabel(selectedItem.value)
    }
    
    return placeholder
  })

  // Фильтрация элементов
  const filteredItems = computed(() => {
    if (!searchQuery.value) return items
    
    const query = searchQuery.value.toLowerCase()
    return items.filter(item => {
      const label = getItemLabel(item).toLowerCase()
      return label.includes(query)
    })
  })

  // Группировка элементов
  const groupedItems = computed(() => {
    const groupKey = groupBy || itemGroup
    
    if (!groupKey) {
      return [{ items: filteredItems.value }]
    }
    
    const groups = {}
    filteredItems.value.forEach(item => {
      const groupName = item[groupKey] || null
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(item)
    })
    
    return Object.entries(groups).map(([group, items]) => ({
      group,
      items
    }))
  })

  // Получение индекса элемента в плоском списке
  const getItemIndex = (groupIndex, itemIndex) => {
    let totalIndex = 0
    for (let i = 0; i < groupIndex; i++) {
      totalIndex += groupedItems.value[i].items.length
    }
    return totalIndex + itemIndex
  }

  // Методы
  const openDropdown = async () => {
    if (disabled) return
    
    isOpen.value = true
    
    await nextTick()
    
    // Фокусируем поле поиска если есть
    if (searchable && searchInputRef.value) {
      searchInputRef.value.focus()
    }
    
    // Сбрасываем фокус на первый элемент
    focusedIndex.value = 0
  }

  const closeDropdown = () => {
    if (isOpen.value) {
      isOpen.value = false
      searchQuery.value = ''
      focusedIndex.value = -1
    }
  }

  const toggleDropdown = () => {
    isOpen.value ? closeDropdown() : openDropdown()
  }

  const selectItem = (item) => {
    if (disabled || isItemDisabled(item)) return
    
    const value = getItemValue(item)
    
    if (multiple) {
      const newValue = Array.isArray(internalValue.value) 
        ? [...internalValue.value]
        : []
      
      const index = newValue.indexOf(value)
      if (index > -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(value)
      }
      
      internalValue.value = newValue
    } else {
      internalValue.value = value
      if (closeOnSelect) {
        closeDropdown()
      }
    }
    
    return internalValue.value
  }

  const clearSelection = () => {
    internalValue.value = multiple ? [] : null
    return internalValue.value
  }

  const handleSearch = () => {
    focusedIndex.value = 0
  }

  const setFocusedIndex = (index) => {
    focusedIndex.value = index
  }

  const focusNextItem = () => {
    const totalItems = groupedItems.value.reduce((sum, group) => sum + group.items.length, 0)
    if (totalItems === 0) return
    
    focusedIndex.value = (focusedIndex.value + 1) % totalItems
    scrollToFocusedItem()
  }

  const focusPrevItem = () => {
    const totalItems = groupedItems.value.reduce((sum, group) => sum + group.items.length, 0)
    if (totalItems === 0) return
    
    focusedIndex.value = (focusedIndex.value - 1 + totalItems) % totalItems
    scrollToFocusedItem()
  }

  const scrollToFocusedItem = () => {
    nextTick(() => {
      const itemElement = itemRefs.value[focusedIndex.value]
      if (itemElement && menuRef.value) {
        itemElement.scrollIntoView({ block: 'nearest' })
      }
    })
  }

  // Обработка клика вне dropdown
  const handleClickOutside = (event) => {
    if (isOpen.value && autoClose && !triggerRef.value?.contains(event.target)) {
      closeDropdown()
    }
  }

  // Обработка клавиатуры
  const handleKeydown = (event) => {
    if (!isOpen.value) return
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusNextItem()
        break
      case 'ArrowUp':
        event.preventDefault()
        focusPrevItem()
        break
      case 'Enter':
        event.preventDefault()
        if (focusedIndex.value >= 0) {
          const flatItems = groupedItems.value.flatMap(group => group.items)
          const item = flatItems[focusedIndex.value]
          if (item && !isItemDisabled(item)) {
            selectItem(item)
          }
        }
        break
      case 'Escape':
        closeDropdown()
        break
      case 'Tab':
        if (autoClose) {
          closeDropdown()
        }
        break
    }
  }

  // Синхронизация с внешним значением
  watch(() => modelValue, (newValue) => {
    internalValue.value = newValue
  }, { deep: true })

  // Инициализация
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    // Рефы
    triggerRef,
    menuRef,
    searchInputRef,
    itemRefs,
    
    // Состояние
    isOpen,
    searchQuery,
    focusedIndex,
    internalValue,
    
    // Вычисляемые значения
    selectedItem,
    triggerText,
    filteredItems,
    groupedItems,
    
    // ID
    menuId,
    triggerId,
    
    // Вспомогательные функции
    getItemValue,
    getItemLabel,
    getItemKey,
    getItemIndex,
    isItemSelected,
    isItemDisabled,
    
    // Методы
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
    selectItem,
    clear: clearSelection,
    handleSearch,
    setFocusedIndex,
    handleClickOutside,
    handleKeydown
  }
}