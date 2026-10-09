<!-- shared/ui/Timer/CountdownTimer.vue -->
<script setup>
import { computed, watch, onUnmounted, onMounted, ref } from 'vue';
import { useTimer } from '../composables/useTimer';

const props = defineProps({
  duration: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  alarmSound: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'simple'
  },
  onComplete: {
    type: Function,
    required: false
  }
});

const emit = defineEmits(['start', 'pause', 'stop', 'complete', 'tick']);

// ========== SIMPLE LOCALSTORAGE HELPERS ==========
const STORAGE_KEY = 'timer'

// Save timer state
const saveTimerState = (remaining, isRunning = true) => {
  if (!STORAGE_KEY) return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    remaining,
    startTime: Date.now(),
    isRunning
  }));
};

// Load timer state
const loadTimerState = () => {
  if (!STORAGE_KEY) return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const saved = JSON.parse(data);
    const now = Date.now();
    const timePassed = Math.floor((now - saved.startTime) / 1000);
    const actualRemaining = Math.max(0, saved.remaining - timePassed);
    
    return {
      remaining: actualRemaining,
      wasRunning: saved.isRunning
    };
  } catch {
    return null;
  }
};

// Clear timer state
const clearTimerState = () => {
  if (!STORAGE_KEY) return;
  localStorage.removeItem(STORAGE_KEY);
};

// ========== TIMER LOGIC ==========
// Load saved timer or use full duration
const savedState = loadTimerState();
const initialElapsed = savedState 
  ? props.duration - savedState.remaining 
  : 0;

const {
  seconds,
  isRunning,
  formattedTimeRemaining,
  progress,
  timeRemaining,
  start,
  pause,
  stop,
  reset,
  setTotalTime
} = useTimer(initialElapsed);

// Set total time to duration
setTotalTime(props.duration);

// Track if timer was resumed
const wasResumed = ref(savedState !== null && savedState.remaining < props.duration);

// Setup auto-save interval
let saveInterval = null;
const setupAutoSave = () => {
  if (saveInterval) clearInterval(saveInterval);
  
  saveInterval = setInterval(() => {
    if (isRunning.value && timeRemaining.value > 0) {
      saveTimerState(timeRemaining.value, true);
    }
  }, 3000); // Save every 5 seconds
};

// Check if timer is complete
const isComplete = computed(() => timeRemaining.value <= 0);


// Watch for completion
watch(isComplete, (complete) => {
  if (complete) {
    emit('complete');
    if (props.alarmSound) {
      playAlarm();
    }
    pause();
    clearTimerState(); // Clear when timer completes
  }
});

// Emit tick events
watch(timeRemaining, (remaining) => {
  emit('tick', remaining);
});

// Auto-start logic
onMounted(() => {
  if (savedState?.wasRunning && savedState.remaining > 0) {
    // Resume saved timer
    startTimer();
  } else if (props.autoStart) {
    // Start fresh timer
    startTimer();
  }
});

// Cleanup
onUnmounted(() => {
  if (saveInterval) clearInterval(saveInterval);
  
  // Save final state if timer is still running or paused
  if (timeRemaining.value > 0) {
    saveTimerState(timeRemaining.value, isRunning.value);
  }
});

// ========== PUBLIC METHODS ==========
const startTimer = () => {
  if (isComplete.value) {
    reset();
  }
  start();
  emit('start', timeRemaining.value);
  setupAutoSave();
};

const pauseTimer = () => {
  pause();
  emit('pause', timeRemaining.value);
  saveTimerState(timeRemaining.value, false);
};

const stopTimer = () => {
  stop();
  emit('stop', timeRemaining.value);
  clearTimerState();
};

const resetTimer = () => {
  reset();
  clearTimerState();
  wasResumed.value = false;
};

// Expose methods if needed
defineExpose({
  start: startTimer,
  pause: pauseTimer,
  stop: stopTimer,
  reset: resetTimer,
  timeRemaining,
  wasResumed
});

// Format initial time for display
const formattedDuration = computed(() => {
  const hrs = Math.floor(props.duration / 3600);
  const mins = Math.floor((props.duration % 3600) / 60);
  const secs = props.duration % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
});
</script>

<template>
  <div class="countdown-timer" :class="{ 'is-complete': isComplete }">
    <div class="countdown-timer__display">
      {{ formattedTimeRemaining }}
    </div>
    
    <div v-if="showProgress" class="countdown-timer__progress">
      <div 
        class="countdown-timer__progress-bar" 
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.countdown-timer {
  &.was-resumed {
    .countdown-timer__display {
      color: #10b981;
    }
  }

  &.is-complete {
    animation: pulse 2s infinite;
  }

  &__display {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .resume-indicator {
      font-size: 12px;
      color: #10b981;
      font-weight: normal;
      opacity: 0.8;
    }
  }

  &__progress {
    margin-top: 8px;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }

  &__progress-bar {
    height: 100%;
    background: #3b82f6;
    transition: width 1s linear;
  }

  &__complete {
    text-align: center;
    padding: 8px;
    margin-top: 8px;
  }

  &__complete-message {
    font-size: 14px;
    font-weight: 600;
    color: #ef4444;
    animation: bounce 1s infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>