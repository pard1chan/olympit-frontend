<template>
  <div class="filter" :class="[`filter--${orientation}`, { 'filter--multiple': multiple }]">
    <!-- Поисковая строка -->
    <div v-if="showSearch" class="filter__search">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="filter__search-input"
        @input="$emit('search', searchQuery)"
      />
      <div class="filter__search-icon">
        <slot name="search-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 14L11.1 11.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </slot>
      </div>
    </div>

    <!-- Список фильтров -->
    <div class="filter__list">
      <button
        v-for="filter in filteredFilters"
        :key="filter.value"
        class="filter__item"
        :class="{
          'filter__item--active': isActive(filter.value),
          'filter__item--disabled': filter.disabled,
          'filter__item--has-icon': filter.icon
        }"
        @click="toggleFilter(filter.value)"
        :disabled="filter.disabled"
        type="button"
      >
        <!-- Иконка -->
        <span v-if="filter.icon" class="filter__item-icon">
          <slot :name="`icon-${filter.value}`" :filter="filter">
            <IconButton :iconComponent="IconFilterActive" size="20px" />
          </slot>
        </span>

        <!-- Текст -->
        <span class="filter__item-label">
          {{ filter.label }}
          <!-- <span v-if="filter.count !== undefined" class="filter__item-count">
            ({{ filter.count }})
          </span> -->
        </span>
      </button>

      <!-- Сообщение если ничего не найдено -->
      <div v-if="filteredFilters.length === 0 && searchQuery" class="filter__empty">
        Ничего не найдено
      </div>
    </div>

    <!-- Активные фильтры (чипсы) -->
    <div v-if="showChips && activeFilters.length > 0" class="filter__chips">
      <div class="filter__chips-label">Выбрано:</div>
      <div class="filter__chips-list">
        <span
          v-for="filter in activeFilters"
          :key="filter.value"
          class="filter__chip"
        >
          {{ filter.label }}
          <button
            @click="removeFilter(filter.value)"
            class="filter__chip-remove"
            type="button"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div v-if="showActions" class="filter__actions">
      <button
        v-if="showReset"
        @click="handleReset"
        :disabled="activeFilters.length === 0"
        class="filter__action filter__action--reset"
        type="button"
      >
        {{ resetText }}
      </button>
      
      <button
        v-if="showApply"
        @click="handleApply"
        class="filter__action filter__action--apply"
        type="button"
      >
        {{ applyText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFilter } from './useFilter'
import Button from '../Button'
import { IconFilterActive } from '../Icons'
import IconButton from '../IconButton'

const emit = defineEmits(['update:modelValue', 'change', 'reset', 'apply', 'search'])

const props = defineProps({
  // Массив фильтров
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  
  // Выбранные значения
  modelValue: {
    type: [Array, String, Number],
    default: () => []
  },
  
  // Множественный выбор
  multiple: {
    type: Boolean,
    default: true
  },
  
  // Показывать поиск
  showSearch: {
    type: Boolean,
    default: false
  },
  
  // Плейсхолдер поиска
  searchPlaceholder: {
    type: String,
    default: 'Поиск...'
  },
  
  // Показывать чипсы
  showChips: {
    type: Boolean,
    default: false
  },
  
  // Показывать действия
  showActions: {
    type: Boolean,
    default: true
  },
  
  // Показывать сброс
  showReset: {
    type: Boolean,
    default: false
  },
  
  // Показывать применить
  showApply: {
    type: Boolean,
    default: false
  },
  
  // Текст кнопок
  resetText: {
    type: String,
    default: 'Сбросить'
  },
  
  applyText: {
    type: String,
    default: 'Применить'
  },
  
  // Ориентация
  orientation: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value)
  },
  
  // Использовать компонент Icon
  useIconComponent: {
    type: Boolean,
    default: false
  }
})

// Используем composition функцию
const {
  filters,
  selectedFilters,
  searchQuery,
  filteredFilters,
  activeFilters,
  isActive,
  toggleFilter,
  resetFilters,
  removeFilter,
  updateFilters
} = useFilter(props.items, { 
  multiple: props.multiple,
  initialSelected: Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue].filter(Boolean)
})

// Проверяем, используется ли компонент Icon
const isIconComponent = computed(() => {
  return props.useIconComponent && typeof window !== 'undefined' && window.Vue
})

// Обновляем фильтры при изменении props
watch(() => props.items, (newItems) => {
  updateFilters(newItems)
}, { deep: true })

// Обновляем выбранные фильтры при изменении modelValue извне
watch(() => props.modelValue, (newValue) => {
  if (props.multiple) {
    selectedFilters.value = Array.isArray(newValue) ? newValue : []
  } else {
    selectedFilters.value = newValue ? [newValue] : []
  }
}, { immediate: true })

// Отслеживаем изменения выбранных фильтров
watch(selectedFilters, (newValue) => {
  if (props.multiple) {
    emit('update:modelValue', [...newValue])
    emit('change', [...newValue])
  } else {
    const value = newValue.length > 0 ? newValue[0] : null
    emit('update:modelValue', value)
    emit('change', value)
  }
}, { deep: true })

// Обработчики
const handleReset = () => {
  resetFilters()
  emit('reset')
}

const handleApply = () => {
  emit('apply', selectedFilters.value)
}
</script>

<style lang="scss" scoped>
.filter {
  --filter-bg: var(--bg-color, #fff);
  --filter-border: var(--border-color, #e0e0e0);
  --filter-text: var(--text-color, #333);
  --filter-text-secondary: var(--text-secondary, #666);
  --filter-primary: var(--primary-color, #007bff);
  --filter-primary-hover: var(--primary-dark, #0056b3);
  --filter-radius: var(--border-radius, 8px);
  --filter-padding: var(--spacing-md, 16px);
  
  background: var(--filter-bg);
  border-radius: var(--filter-radius);
  padding: var(--filter-padding);
  
  &--horizontal {
    .filter__list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
  
  &__search {
    position: relative;
    margin-bottom: 16px;
    
    &-input {
      width: 100%;
      padding: 10px 40px 10px 16px;
      border: 1px solid var(--filter-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--filter-bg);
      color: var(--filter-text);
      
      &:focus {
        outline: none;
        border-color: var(--filter-primary);
      }
      
      &::placeholder {
        color: var(--filter-text-secondary);
      }
    }
    
    &-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--filter-text-secondary);
      pointer-events: none;
      
      svg {
        display: block;
      }
    }
  }
  
  &__list {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
  
  &__item {
    max-width: 162px;
    display: flex;
    align-items: center;
    column-gap: 10px;

    padding: 10px 12px;
    border: 1px solid var(--filter-border);
    border-radius: 6px;
    background: var(--filter-bg);
    color: var(--filter-text);
    text-align: left;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    
    &:hover:not(:disabled) {
      border-color: var(--filter-primary);
      background: rgba(var(--filter-primary), 0.05);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &--active {
      border-color: var(--filter-primary);
      background: rgba(var(--filter-primary), 0.1);
      color: var(--filter-primary);
    }

    &-icon {
      @include flex-center(true);
    }

    &-label {
      flex: 1;
    }
    
    &-count {
      color: var(--filter-text-secondary);
      font-size: 12px;
      margin-left: 4px;
    }
    
    &-check {
      margin-left: 8px;
      color: var(--filter-primary);
      
      svg {
        display: block;
      }
    }
  }
  
  &__empty {
    padding: 12px;
    text-align: center;
    color: var(--filter-text-secondary);
    font-size: 14px;
  }
  
  &__chips {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--filter-border);
    
    &-label {
      font-size: 12px;
      color: var(--filter-text-secondary);
      margin-bottom: 8px;
    }
    
    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }
  
  &__chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: rgba(var(--filter-primary), 0.1);
    border: 1px solid var(--filter-primary);
    border-radius: 16px;
    font-size: 12px;
    color: var(--filter-primary);
    
    &-remove {
      margin-left: 6px;
      padding: 0;
      background: none;
      border: none;
      color: inherit;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      opacity: 0.7;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  &__actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    padding-top: 16px;
  }
  
  &__action {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &--reset {
      background: transparent;
      border: 1px solid var(--filter-border);
      color: var(--filter-text-secondary);
      
      &:hover:not(:disabled) {
        border-color: var(--error-color, #dc3545);
        color: var(--error-color, #dc3545);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    &--apply {
      background: var(--filter-primary);
      border: 1px solid var(--filter-primary);
      color: white;
      
      &:hover {
        background: var(--filter-primary-hover);
        border-color: var(--filter-primary-hover);
      }
    }
  }
}
</style>