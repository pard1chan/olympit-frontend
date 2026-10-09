<template>
  <div class="progress-container">
    <div class="progress" :style="{ height }">
      <div 
        class="progress__line" 
        :style="lineStyles"
        :class="{ 'progress__line--animated': animated }"
      ></div>
    </div>
    
    <div v-if="showLabel" class="progress__label">{{ progress }}%</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'linear-gradient(90deg, #FFA3C4 0%, #FF7BAC 100%)'
  },
  backgroundColor: {
    type: String,
    default: '#f0f0f0'
  },
  height: {
    type: String,
    default: '8px'
  },
  borderRadius: {
    type: String,
    default: '4px'
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  labelPosition: {
    type: String,
    default: 'outside-right', // 'outside-right', 'outside-left', 'inside'
    validator: (value) => ['outside-right', 'outside-left', 'inside'].includes(value)
  },
  animated: {
    type: Boolean,
    default: true
  },
  striped: {
    type: Boolean,
    default: false
  },
  labelWidth: {
    type: String,
    default: '40px' // Ширина области для процентов
  }
})

const clampedProgress = computed(() => 
  Math.min(100, Math.max(0, props.progress))
)

const lineStyles = computed(() => ({
  width: `${clampedProgress.value}%`,
  background: props.color,
  borderRadius: props.borderRadius
}))
</script>

<style lang="scss" scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress {
  flex: 1;
  position: relative;
  background-color: v-bind('props.backgroundColor');
  border-radius: v-bind('props.borderRadius');
  overflow: hidden;
  height: v-bind('props.height');
  
  &__line {
    height: 100%;
    border-radius: v-bind('props.borderRadius');
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &--animated {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-image: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        );
        background-size: 1rem 1rem;
        animation: progress-stripes 1s linear infinite;
      }
    }
  }
  
  &__label {
    min-width: v-bind('props.labelWidth');
    text-align: right;
    font-size: 14px;
    font-weight: 300;
    color: var(--color-primary);
    white-space: nowrap;
    
    // Для позиционирования внутри
    .progress-container:has(.progress__label--inside) & {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      min-width: auto;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    // Для позиционирования слева
    .progress-container:has(.progress__label--outside-left) & {
      order: -1;
      text-align: left;
    }
  }
}

@keyframes progress-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>