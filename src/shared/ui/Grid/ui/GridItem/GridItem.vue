<!-- shared/ui/Grid/GridItem.vue -->
<template>
  <div 
    class="grid-item" 
    :class="[
      `grid-item--${area}`,
      { 'grid-item--full-width': fullWidth },
      { 'grid-item--full-height': fullHeight },
      { 'grid-item--mobile': isMobile },
      { 'grid-item--tablet': isTablet },
      { 'grid-item--desktop': isDesktop }
    ]"
    :style="itemStyles"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Позиционирование в grid (десктоп)
  area: {
    type: String,
    default: ''
  },
  column: {
    type: [Number, String],
    default: ''
  },
  row: {
    type: [Number, String],
    default: ''
  },
  columnStart: {
    type: [Number, String],
    default: ''
  },
  columnEnd: {
    type: [Number, String],
    default: ''
  },
  rowStart: {
    type: [Number, String],
    default: ''
  },
  rowEnd: {
    type: [Number, String],
    default: ''
  },
  
  // Планшетные overrides
  tabletArea: {
    type: String,
    default: ''
  },
  tabletColumn: {
    type: [Number, String],
    default: ''
  },
  tabletRow: {
    type: [Number, String],
    default: ''
  },
  tabletColumnStart: {
    type: [Number, String],
    default: ''
  },
  tabletColumnEnd: {
    type: [Number, String],
    default: ''
  },
  tabletRowStart: {
    type: [Number, String],
    default: ''
  },
  tabletRowEnd: {
    type: [Number, String],
    default: ''
  },
  
  // Мобильные overrides
  mobileArea: {
    type: String,
    default: ''
  },
  mobileColumn: {
    type: [Number, String],
    default: ''
  },
  mobileRow: {
    type: [Number, String],
    default: ''
  },
  mobileColumnStart: {
    type: [Number, String],
    default: ''
  },
  mobileColumnEnd: {
    type: [Number, String],
    default: ''
  },
  mobileRowStart: {
    type: [Number, String],
    default: ''
  },
  mobileRowEnd: {
    type: [Number, String],
    default: ''
  },
  
  // Размеры
  fullWidth: {
    type: Boolean,
    default: false
  },
  fullHeight: {
    type: Boolean,
    default: false
  },
  
  // Выравнивание
  alignSelf: {
    type: String,
    default: 'stretch'
  },
  justifySelf: {
    type: String,
    default: 'stretch'
  },
  
  // Брейкпоинты
  tabletBreakpoint: {
    type: Number,
    default: 768
  },
  mobileBreakpoint: {
    type: Number,
    default: 576
  }
})

// Реактивная проверка на устройства
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()

const isMobile = computed(() => width.value < props.mobileBreakpoint)
const isTablet = computed(() => 
  width.value >= props.mobileBreakpoint && width.value < props.tabletBreakpoint
)
const isDesktop = computed(() => width.value >= props.tabletBreakpoint)

// Вычисляемые стили
const itemStyles = computed(() => {
  const styles = {}
  
  // Выравнивание
  styles.alignSelf = props.alignSelf
  styles.justifySelf = props.justifySelf
  
  // Размеры
  if (props.fullWidth) {
    styles.width = '100%'
  }
  if (props.fullHeight) {
    styles.height = '100%'
  }
  
  // Применяем стили в зависимости от устройства
  if (isMobile.value) {
    applyMobileStyles(styles)
  } else if (isTablet.value) {
    applyTabletStyles(styles)
  } else {
    applyDesktopStyles(styles)
  }
  
  return styles
})

// Функции для применения стилей
const applyDesktopStyles = (styles) => {
  if (props.area) styles.gridArea = props.area
  if (props.column) styles.gridColumn = props.column
  if (props.row) styles.gridRow = props.row
  if (props.columnStart) styles.gridColumnStart = props.columnStart
  if (props.columnEnd) styles.gridColumnEnd = props.columnEnd
  if (props.rowStart) styles.gridRowStart = props.rowStart
  if (props.rowEnd) styles.gridRowEnd = props.rowEnd
}

const applyTabletStyles = (styles) => {
  // Приоритет: tabletArea > area
  if (props.tabletArea) {
    styles.gridArea = props.tabletArea
  } else if (props.area) {
    styles.gridArea = props.area
  }
  
  // Аналогично для других свойств
  if (props.tabletColumn) {
    styles.gridColumn = props.tabletColumn
  } else if (props.column) {
    styles.gridColumn = props.column
  }
  
  if (props.tabletRow) {
    styles.gridRow = props.tabletRow
  } else if (props.row) {
    styles.gridRow = props.row
  }
  
  // Точное позиционирование для планшета
  if (props.tabletColumnStart) styles.gridColumnStart = props.tabletColumnStart
  else if (props.columnStart) styles.gridColumnStart = props.columnStart
  
  if (props.tabletColumnEnd) styles.gridColumnEnd = props.tabletColumnEnd
  else if (props.columnEnd) styles.gridColumnEnd = props.columnEnd
  
  if (props.tabletRowStart) styles.gridRowStart = props.tabletRowStart
  else if (props.rowStart) styles.gridRowStart = props.rowStart
  
  if (props.tabletRowEnd) styles.gridRowEnd = props.tabletRowEnd
  else if (props.rowEnd) styles.gridRowEnd = props.rowEnd
}

const applyMobileStyles = (styles) => {
  if (props.mobileArea) {
    styles.gridArea = props.mobileArea
  } else if (props.tabletArea) {
    styles.gridArea = props.tabletArea
  } else if (props.area) {
    styles.gridArea = props.area
  }
  
  if (props.mobileColumn) {
    styles.gridColumn = props.mobileColumn
  } else if (props.tabletColumn) {
    styles.gridColumn = props.tabletColumn
  } else if (props.column) {
    styles.gridColumn = props.column
  }
  
  if (props.mobileRow) {
    styles.gridRow = props.mobileRow
  } else if (props.tabletRow) {
    styles.gridRow = props.tabletRow
  } else if (props.row) {
    styles.gridRow = props.row
  }
  
  // Точное позиционирование для мобильных
  if (props.mobileColumnStart) styles.gridColumnStart = props.mobileColumnStart
  else if (props.tabletColumnStart) styles.gridColumnStart = props.tabletColumnStart
  else if (props.columnStart) styles.gridColumnStart = props.columnStart
  
  if (props.mobileColumnEnd) styles.gridColumnEnd = props.mobileColumnEnd
  else if (props.tabletColumnEnd) styles.gridColumnEnd = props.tabletColumnEnd
  else if (props.columnEnd) styles.gridColumnEnd = props.columnEnd
  
  if (props.mobileRowStart) styles.gridRowStart = props.mobileRowStart
  else if (props.tabletRowStart) styles.gridRowStart = props.tabletRowStart
  else if (props.rowStart) styles.gridRowStart = props.rowStart
  
  if (props.mobileRowEnd) styles.gridRowEnd = props.mobileRowEnd
  else if (props.tabletRowEnd) styles.gridRowEnd = props.tabletRowEnd
  else if (props.rowEnd) styles.gridRowEnd = props.rowEnd
}
</script>

<style lang="scss" scoped>
.grid-item {
  min-width: 0;
  min-height: 0;
  
  &--mobile {
    // Дополнительные стили для мобильных
  }
  
  &--tablet {
    // Дополнительные стили для планшетов
  }
  
  &--desktop {
    // Дополнительные стили для десктопа
  }
}
</style>