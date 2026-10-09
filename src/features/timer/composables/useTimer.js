// shared/lib/composables/useTimer.js
import { ref, onUnmounted, computed } from 'vue';

export function useTimer(initialSeconds = 0) {
  const seconds = ref(initialSeconds);
  const isRunning = ref(false);
  const timerId = ref(null);
  const totalTime = ref(initialSeconds);

  const start = () => {
    if (isRunning.value) return;
    
    isRunning.value = true;
    timerId.value = setInterval(() => {
      seconds.value++;
    }, 1000);
  };

  const pause = () => {
    if (!isRunning.value) return;
    
    isRunning.value = false;
    clearInterval(timerId.value);
    timerId.value = null;
  };

  const stop = () => {
    isRunning.value = false;
    clearInterval(timerId.value);
    timerId.value = null;
    seconds.value = 0;
  };

  const reset = () => {
    stop();
    seconds.value = initialSeconds;
  };

  const restart = () => {
    stop();
    seconds.value = 0;
    start();
  };

  // Format time (MM:SS or HH:MM:SS)
  const formattedTime = computed(() => {
    const hrs = Math.floor(seconds.value / 3600);
    const mins = Math.floor((seconds.value % 3600) / 60);
    const secs = seconds.value % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  // Progress percentage (for countdown mode)
  const progress = computed(() => {
    if (totalTime.value === 0) return 0;
    return Math.min((seconds.value / totalTime.value) * 100, 100);
  });

  // Time remaining (for countdown)
  const timeRemaining = computed(() => {
    return totalTime.value - seconds.value;
  });

  const formattedTimeRemaining = computed(() => {
    const remaining = timeRemaining.value;
    if (remaining <= 0) return '00:00';
    
    const hrs = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  onUnmounted(() => {
    if (timerId.value) {
      clearInterval(timerId.value);
    }
  });

  return {
    seconds,
    isRunning,
    formattedTime,
    formattedTimeRemaining,
    progress,
    timeRemaining,
    start,
    pause,
    stop,
    reset,
    restart,
    setTotalTime: (time) => totalTime.value = time
  };
}