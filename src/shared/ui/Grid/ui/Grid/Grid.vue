<!-- shared/ui/Grid/Grid.vue -->
<template>
  <div class="grid" :class="[
    `grid--${columns}-cols`,
    `grid--${rows}-rows`,
    { 'grid--mobile': isMobile },
    { 'grid--tablet': isTablet },
    { 'grid--desktop': isDesktop }
  ]" :style="gridStyles">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Основные параметры (десктоп)
  columns: {
    type: [Number, String],
    default: 1
  },
  rows: {
    type: [Number, String],
    default: 'auto'
  },
  gap: {
    type: [Number, String],
    default: '20px'
  },

  // Grid template (десктоп)
  templateColumns: {
    type: String,
    default: ''
  },
  templateRows: {
    type: String,
    default: ''
  },
  templateAreas: {
    type: Array,
    default: () => []
  },

  // Tablet breakpoints
  tabletBreakpoint: {
    type: Number,
    default: 768
  },
  mobileBreakpoint: {
    type: Number,
    default: 576
  },

  // Tablet overrides
  tabletColumns: {
    type: [Number, String],
    default: null // Если null, используется desktop значение
  },
  tabletRows: {
    type: [Number, String],
    default: null
  },
  tabletTemplateAreas: {
    type: Array,
    default: () => []
  },
  tabletGap: {
    type: String,
    default: ''
  },

  // Mobile overrides
  mobileColumns: {
    type: [Number, String],
    default: 1
  },
  mobileRows: {
    type: [Number, String],
    default: 'auto'
  },
  mobileTemplateAreas: {
    type: Array,
    default: () => []
  },
  mobileGap: {
    type: String,
    default: ''
  },

  // Дополнительные стили
  alignContent: {
    type: String,
    default: 'stretch'
  },
  alignItems: {
    type: String,
    default: 'stretch'
  },
  justifyContent: {
    type: String,
    default: 'stretch'
  },
  justifyItems: {
    type: String,
    default: 'stretch'
  },

  tabletTemplateRows: {
    type: String,
    default: ''
  },
  tabletTemplateColumns: {
    type: String,
    default: ''
  },

  // Mobile template rows (добавь)
  mobileTemplateRows: {
    type: String,
    default: ''
  },
  mobileTemplateColumns: {
    type: String,
    default: ''
  },
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
const gridStyles = computed(() => {
  const styles = {}

  // Основные стили
  styles.gap = typeof props.gap === 'number' ? `${props.gap}px` : props.gap
  styles.alignContent = props.alignContent
  styles.alignItems = props.alignItems
  styles.justifyContent = props.justifyContent
  styles.justifyItems = props.justifyItems

  // Мобильная версия
  if (isMobile.value) {
    applyMobileStyles(styles)
  }
  // Планшетная версия
  else if (isTablet.value) {
    applyTabletStyles(styles)
  }
  // Десктопная версия
  else {
    applyDesktopStyles(styles)
  }

  return styles
})

// Функции для применения стилей
const applyDesktopStyles = (styles) => {
  if (props.templateColumns) {
    styles.gridTemplateColumns = props.templateColumns
  } else if (typeof props.columns === 'number') {
    styles.gridTemplateColumns = `repeat(${props.columns}, 1fr)`
  }

  if (props.templateRows) {
    styles.gridTemplateRows = props.templateRows
  } else if (props.rows !== 'auto') {
    styles.gridTemplateRows = typeof props.rows === 'number'
      ? `repeat(${props.rows}, 1fr)`
      : props.rows
  }

  if (props.templateAreas.length > 0) {
    styles.gridTemplateAreas = props.templateAreas
      .map(row => `"${row}"`)
      .join(' ')
  }
}

// В Grid.vue, в функции applyTabletStyles:
const applyTabletStyles = (styles) => {
  // Gap для планшета
  if (props.tabletGap) {
    styles.gap = props.tabletGap
  }

  // Template columns для планшета
  if (props.tabletTemplateColumns) {
    styles.gridTemplateColumns = props.tabletTemplateColumns
  } else if (props.tabletTemplateAreas.length > 0) {
    styles.gridTemplateAreas = props.tabletTemplateAreas
      .map(row => `"${row}"`)
      .join(' ')
  } else if (typeof props.tabletColumns === 'number') {
    styles.gridTemplateColumns = `repeat(${props.tabletColumns}, 1fr)`
  } else if (props.tabletColumns === null && typeof props.columns === 'number') {
    styles.gridTemplateColumns = `repeat(${props.columns}, 1fr)`
  }

  // Template rows для планшета - НОВОЕ!
  if (props.tabletTemplateRows) {
    styles.gridTemplateRows = props.tabletTemplateRows
  } else if (props.tabletRows !== 'auto') {
    if (props.tabletRows !== null) {
      styles.gridTemplateRows = typeof props.tabletRows === 'number'
        ? `repeat(${props.tabletRows}, 1fr)`
        : props.tabletRows
    } else if (props.rows !== 'auto') {
      styles.gridTemplateRows = typeof props.rows === 'number'
        ? `repeat(${props.rows}, 1fr)`
        : props.rows
    }
  }

  // Если для планшета не заданы особые настройки, используем десктопные
  if (!styles.gridTemplateColumns && props.templateColumns) {
    styles.gridTemplateColumns = props.templateColumns
  }
  if (!styles.gridTemplateRows && props.templateRows) {
    styles.gridTemplateRows = props.templateRows
  }
  if (!styles.gridTemplateAreas && props.templateAreas.length > 0) {
    styles.gridTemplateAreas = props.templateAreas
      .map(row => `"${row}"`)
      .join(' ')
  }
}

// В Grid.vue, в функции applyMobileStyles:
const applyMobileStyles = (styles) => {
  if (props.mobileGap) {
    styles.gap = props.mobileGap
  }
  
  // Template columns для мобильных
  if (props.mobileTemplateColumns) {
    styles.gridTemplateColumns = props.mobileTemplateColumns
  } else if (props.mobileTemplateAreas.length > 0) {
    styles.gridTemplateAreas = props.mobileTemplateAreas
      .map(row => `"${row}"`)
      .join(' ')
  } else if (typeof props.mobileColumns === 'number') {
    styles.gridTemplateColumns = `repeat(${props.mobileColumns}, 1fr)`
  }
  
  // Template rows для мобильных - НОВОЕ!
  if (props.mobileTemplateRows) {
    styles.gridTemplateRows = props.mobileTemplateRows
  } else if (props.mobileRows !== 'auto') {
    styles.gridTemplateRows = typeof props.mobileRows === 'number'
      ? `repeat(${props.mobileRows}, 1fr)`
      : props.mobileRows
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  width: 100%;
  height: 100%;

  // Опциональные CSS-классы для кастомизации
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