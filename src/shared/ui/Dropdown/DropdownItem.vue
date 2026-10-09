<template>
  <div
    ref="itemRef"
    class="dropdown-item"
    :class="[
      `dropdown-item--${variant}`,
      { 'dropdown-item--selected': selected },
      { 'dropdown-item--disabled': disabled },
      { 'dropdown-item--focused': focused },
      { 'dropdown-item--danger': danger }
    ]"
    @click="handleClick"
    @mouseenter="$emit('mouseenter', $event)"
    :data-value="itemValue"
    role="menuitem"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
  >
    <slot :item="item" :selected="selected" :disabled="disabled">
      <!-- Дефолтный слот -->
      <span class="dropdown-item__content">
        <!-- Префикс (иконка/чекбокс) -->
        <span v-if="$slots.prefix" class="dropdown-item__prefix">
          <slot name="prefix" />
        </span>
        
        <!-- Основной контент -->
        <span class="dropdown-item__main">
          <slot name="default" :item="item">
            {{ itemLabel }}
          </slot>
        </span>
        
        <!-- Суффикс (бадж/иконка) -->
        <span v-if="$slots.suffix" class="dropdown-item__suffix">
          <slot name="suffix" />
        </span>
      </span>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: [Object, String, Number],
    default: null
  },
  selected: Boolean,
  disabled: Boolean,
  focused: Boolean,
  danger: Boolean,
  variant: {
    type: String,
    default: 'default', // 'default', 'primary', 'danger', 'success', 'warning'
    validator: (value) => ['default', 'primary', 'danger', 'success', 'warning'].includes(value)
  },
  itemValue: {
    type: String,
    default: 'value'
  },
  itemLabel: {
    type: String,
    default: 'label'
  }
})

const emit = defineEmits(['click', 'mouseenter'])

// Вычисляемые значения
const itemValue = computed(() => {
  if (typeof props.item === 'object' && props.item !== null) {
    return props.item[props.itemValue]
  }
  return props.item
})

const itemLabel = computed(() => {
  if (typeof props.item === 'object' && props.item !== null) {
    return props.item[props.itemLabel] || String(props.item[props.itemValue])
  }
  return String(props.item)
})

// Обработчик клика
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', props.item, event)
  }
}
</script>

<style lang="scss" scoped>
.dropdown-item {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-duration);
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  font-weight: 600;
  
  &:hover:not(&--disabled),
  &--focused:not(&--disabled) {
    background: var(--color-bg-hover);
  }
  
  &--selected:not(&--disabled) {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &--danger {
    color: var(--color-danger);
    
    &:hover:not(.dropdown-item--disabled) {
      background: var(--color-danger-light);
    }
    
    &.dropdown-item--selected:not(.dropdown-item--disabled) {
      background: var(--color-danger-light);
      color: var(--color-danger);
    }
  }
  
  &--primary {
    color: var(--color-primary);
  }
  
  &--success {
    color: var(--color-success);
  }
  
  &--warning {
    color: var(--color-warning);
  }
  
  &__content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: var(--spacing-sm);
  }
  
  &__prefix,
  &__suffix {
    display: flex;
    align-items: center;
  }
  
  &__main {
    flex: 1;
    text-align: left;
  }
}

// Маленький размер
.dropdown--small .dropdown-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

// Большой размер
.dropdown--large .dropdown-item {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
}
</style>