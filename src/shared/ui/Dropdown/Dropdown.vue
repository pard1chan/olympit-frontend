<template>
  <div class="dropdown block" :class="[
    `dropdown--${placement}`,
    `dropdown--${mode}`,
    `dropdown--${size}`,
    { 'dropdown--open': isOpen },
    { 'dropdown--disabled': disabled }
  ]">
    <!-- Триггер (кнопка/селект) -->
    <div 
      ref="triggerRef" 
      class="dropdown__trigger" 
      @click="toggle" 
      @keydown.esc="close" 
      >
      <slot name="trigger" :is-open="isOpen" :selected="selectedItem">
        <Button class="dropdown__default-trigger" :class="triggerClass" :disabled="disabled" mode="transparent" color="primary">
          <div class="trigger-text">{{ triggerText }}</div>
          <IconButton size="20px" :icon-component="DropDownIcon" class="dropdown__trigger-icon" :class="{ 'dropdown__icon--rotated': isOpen }"/>
        </Button>
      </slot>
    </div>

    <!-- Выпадающее меню -->
    <Transition :name="animation">
      <div v-if="isOpen" :id="menuId" ref="menuRef" class="dropdown__menu block" :style="menuStyles" role="menu"
        :aria-labelledby="triggerId">
        <!-- Поиск (опционально) -->
        <div v-if="searchable" class="dropdown__search">
          <input ref="searchInputRef" v-model="searchQuery" type="text" class="dropdown__search-input"
            :placeholder="searchPlaceholder" @input="handleSearch" @keydown.esc="close"
            @keydown.down.prevent="focusNextItem" @keydown.up.prevent="focusPrevItem" />
        </div>

        <!-- Список опций -->
        <div class="dropdown__list" :style="{ maxHeight }">
          <!-- Загрузка -->
          <div v-if="loading" class="dropdown__loading">
            <slot name="loading">
              <div class="dropdown__loading-spinner"></div>
              <span>{{ loadingText }}</span>
            </slot>
          </div>

          <!-- Пустой список -->
          <div v-else-if="filteredItems.length === 0" class="dropdown__empty">
            <slot name="empty">
              {{ emptyText }}
            </slot>
          </div>

          <!-- Элементы -->
          <slot v-else>
            <template v-for="(group, groupIndex) in groupedItems" :key="groupIndex">
              <!-- Заголовок группы -->
              <!-- <div v-if="group.group !== null" class="dropdown__group-header"> -->
              <!-- {{ group.group }} -->
              <!-- </div> -->

              <!-- Элементы группы -->
              <DropdownItem v-for="(item, index) in group.items" :key="getItemKey(item, index)" :item="item"
                :selected="isItemSelected(item)" :disabled="isItemDisabled(item)"
                :focused="focusedIndex === getItemIndex(groupIndex, index)" @click="handleItemClick(item)"
                @mouseenter="setFocusedIndex(getItemIndex(groupIndex, index))">
                <template #default="{ item }">
                  <slot name="item" :item="item" :index="index">
                    <!-- Дефолтный рендер элемента -->
                    <div class="dropdown__item-content">
                      <!-- Чекбокс для мультиселекта -->
                      <span v-if="multiple" class="dropdown__item-checkbox"
                        :class="{ 'dropdown__item-checkbox--checked': isItemSelected(item) }">
                        ✓
                      </span>

                      <!-- Иконка элемента -->
                      <span v-if="item.icon || $slots['item-icon']" class="dropdown__item-icon">
                        <slot name="item-icon" :item="item">
                          <component :is="item.icon" v-if="item.icon" />
                        </slot>
                      </span>

                      <!-- Текст элемента -->
                      <span class="dropdown__item-text">
                        {{ getItemLabel(item) }}
                      </span>
                    </div>
                  </slot>
                </template>
              </DropdownItem>
            </template>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { DropDownIcon } from '@/shared/ui/Icons'
import DropdownItem from './DropdownItem.vue'
import { useDropdown } from '@/shared/lib/composables/useDropdown'
import { useClickOutside } from '@/shared/lib/composables/useClickOutside'
import Button from '../Button'
import IconButton from '../IconButton'

const props = defineProps({
  // Данные
  modelValue: {
    type: [String, Number, Array, Object],
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  itemValue: {
    type: String,
    default: 'value'
  },
  itemLabel: {
    type: String,
    default: 'label'
  },
  itemDisabled: {
    type: String,
    default: 'disabled'
  },
  itemGroup: {
    type: String,
    default: 'group'
  },
  mode: {
    type: String,
    required: false
  },

  // Поведение
  multiple: Boolean,
  searchable: Boolean,
  clearable: Boolean,
  disabled: Boolean,
  loading: Boolean,
  closeOnSelect: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Boolean,
    default: true
  },

  // Внешний вид
  placement: {
    type: String,
    default: 'bottom-start',
    validator: (value) => [
      'top', 'top-start', 'top-end',
      'bottom', 'bottom-start', 'bottom-end',
      'left', 'left-start', 'left-end',
      'right', 'right-start', 'right-end'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  triggerClass: String,
  maxHeight: {
    type: String,
    default: '300px'
  },
  width: String,

  // Тексты
  placeholder: {
    type: String,
    default: 'Выберите значение'
  },
  searchPlaceholder: {
    type: String,
    default: 'Поиск...'
  },
  loadingText: {
    type: String,
    default: 'Загрузка...'
  },
  emptyText: {
    type: String,
    default: 'Нет данных'
  },
  noResultsText: {
    type: String,
    default: 'Ничего не найдено'
  },

  // Анимация
  animation: {
    type: String,
    default: 'fade'
  },

  // Группировка
  groupBy: String
})

const emit = defineEmits([
  'update:modelValue',
  'change',
  'open',
  'close',
  'search',
  'clear'
])

// Используем композейбл
const {
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
  open,
  close,
  toggle,
  selectItem,
  clear: clearSelection,
  handleSearch,
  setFocusedIndex,
  handleClickOutside,
  handleKeydown
} = useDropdown({
  items: props.items,
  modelValue: props.modelValue,
  multiple: props.multiple,
  searchable: props.searchable,
  disabled: props.disabled,
  loading: props.loading,
  closeOnSelect: props.closeOnSelect,
  autoClose: props.autoClose,
  itemValue: props.itemValue,
  itemLabel: props.itemLabel,
  itemDisabled: props.itemDisabled,
  itemGroup: props.itemGroup,
  groupBy: props.groupBy,
  placeholder: props.placeholder,
  searchPlaceholder: props.searchPlaceholder,
  emptyText: props.emptyText
})

// Стили меню
const menuStyles = computed(() => ({
  width: props.width || (triggerRef.value?.offsetWidth + 'px'),
  // minWidth: '100%'
}))

// Обработчик клика на элемент
const handleItemClick = (item) => {
  const newValue = selectItem(item)
  emit('update:modelValue', newValue)
  emit('change', newValue, item)
}

// Обработчик очистки
const clear = () => {
  const newValue = clearSelection()
  emit('update:modelValue', newValue)
  emit('change', newValue)
  emit('clear')
}

// Используем click outside композейбл
const { destroy } = useClickOutside(triggerRef, (event) => {
  handleClickOutside(event)
})

// Синхронизация с v-model
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
}, { deep: true })

// Эмиты событий открытия/закрытия
watch(isOpen, (value) => {
  if (value) {
    emit('open')
  } else {
    emit('close')
  }
})

// Эмит события поиска
watch(searchQuery, (value) => {
  emit('search', value)
})

// Экспорт методов
defineExpose({
  open,
  close,
  toggle,
  clear,
  isOpen
})
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;

  &__default-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    gap: 0 10px;
    width: 100%;
    cursor: pointer;
    transition: all var(--transition-duration);

    &:hover {
      background: none;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &--transparent {
    box-shadow: none;
    border: 1px solid #e9ecef;
  }

  &__trigger-icon {
    transition: transform var(--transition-duration);
  }

  &__icon--rotated {
    transform: rotate(180deg);
  }

  &__menu {
    position: absolute;
    z-index: 100;
    overflow: hidden;

    // Позиционирование
    .dropdown--bottom-start & {
      top: 100%;
      left: 0;
      margin-top: 4px;
    }

    .dropdown--bottom-end & {
      top: 100%;
      right: 0;
      margin-top: 4px;
    }

    .dropdown--top-start & {
      bottom: 100%;
      left: 0;
      margin-bottom: 4px;
    }

    .dropdown--top-end & {
      bottom: 100%;
      right: 0;
      margin-bottom: 4px;
    }
  }
  .trigger-text {
    font-size: 16px;
    font-weight: 400;
  }
  &__search {
    padding: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border-light);
  }

  &__search-input {
    width: 100%;
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-xs);
    font-size: var(--font-size-sm);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  &__list {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    overscroll-behavior: contain;
  }

  &__loading,
  &__empty {
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  &__loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: dropdown-spin 0.6s linear infinite;
    margin-right: var(--spacing-xs);
  }

  &__group-header {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-light);
    border-bottom: 1px solid var(--color-border-light);
  }

  &__item-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: var(--spacing-sm);
  }

  &__item-checkbox {
    width: 16px;
    height: 16px;
    border: 1px solid var(--color-border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: transparent;
    transition: all var(--transition-duration);

    &--checked {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }
  }

  &__item-icon {
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
  }

  &__item-text {
    flex: 1;
    text-align: left;

    @include mobile {
      padding: fluid(10, 5);

      font-size: 16px;
    }
  }



}



.dropdown--large {
  .dropdown__default-trigger {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
  }
}

// Анимации
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all var(--transition-duration);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes dropdown-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>