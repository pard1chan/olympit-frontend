<!-- shared/ui/Timer/Stopwatch.vue -->
<script setup>

const props = defineProps({
  showControls: {
    type: Boolean,
    default: true
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  initialTime: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['start', 'pause', 'stop', 'tick']);

const {
  seconds,
  isRunning,
  formattedTime,
  start,
  pause,
  stop,
  reset
} = useTimer(props.initialTime);

// Auto-start if prop is set
import { onMounted } from 'vue';
onMounted(() => {
  if (props.autoStart) {
    start();
  }
});

// Emit tick events
import { watch } from 'vue';
import { useTimer } from '../composables/useTimer';
watch(seconds, (newSeconds) => {
  emit('tick', newSeconds);
});

const handleStart = () => {
  start();
  emit('start', seconds.value);
};

const handlePause = () => {
  pause();
  emit('pause', seconds.value);
};

const handleStop = () => {
  stop();
  emit('stop', seconds.value);
};

const handleReset = () => {
  reset();
};
</script>

<template>
  <div class="stopwatch">
    <div class="stopwatch__time">
      {{ formattedTime }}
    </div>
    
    <div v-if="showControls" class="stopwatch__controls">
      <button 
        v-if="!isRunning" 
        @click="handleStart" 
        class="stopwatch__button stopwatch__button--start"
        aria-label="Start"
      >
        <PlayIcon />
      </button>
      
      <button 
        v-else 
        @click="handlePause" 
        class="stopwatch__button stopwatch__button--pause"
        aria-label="Pause"
      >
        <PauseIcon />
      </button>
      
      <button 
        @click="handleStop" 
        class="stopwatch__button stopwatch__button--stop"
        aria-label="Stop"
        :disabled="!isRunning && seconds === 0"
      >
        <StopIcon />
      </button>
      
      <button 
        @click="handleReset" 
        class="stopwatch__button stopwatch__button--reset"
        aria-label="Reset"
        :disabled="seconds === 0"
      >
        <RefreshIcon />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stopwatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &__time {
    font-family: 'Courier New', monospace;
    font-size: 48px;
    font-weight: 700;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &__controls {
    display: flex;
    gap: 12px;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    &--start {
      background: #10b981;
      
      &:hover:not(:disabled) {
        background: #059669;
      }
    }

    &--pause {
      background: #f59e0b;
      
      &:hover:not(:disabled) {
        background: #d97706;
      }
    }

    &--stop {
      background: #ef4444;
      
      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }

    &--reset {
      background: #6b7280;
      
      &:hover:not(:disabled) {
        background: #4b5563;
      }
    }
  }
}
</style>