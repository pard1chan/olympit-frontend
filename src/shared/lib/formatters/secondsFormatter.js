// shared/lib/composables/useTimeFormatter.js
export function useTimeFormatter() {
  const formatSeconds = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return '0s';
    }
    
    // If less than 60 seconds, show seconds
    if (seconds < 60) {
      return `${Math.floor(seconds)}s`;
    }
    
    // If less than 3600 seconds (1 hour), show minutes
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (remainingSeconds === 0) {
        return `${minutes}m`;
      }
      return `${minutes}m ${remainingSeconds}s`;
    }
    
    // For 1 hour or more, show hours and minutes
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };
  
  const formatSecondsReadable = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return '0 seconds';
    }
    
    if (seconds < 60) {
      return `${Math.floor(seconds)} second${seconds !== 1 ? 's' : ''}`;
    }
    
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (remainingSeconds === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };
  
  const formatSecondsToHoursMinutes = (seconds, showSeconds = false) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return '0:00';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      if (showSeconds) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    
    if (showSeconds) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}m`;
  };
  
  // Format for countdown timer (MM:SS or HH:MM:SS)
  const formatCountdown = (seconds) => {
    if (seconds < 0) return '00:00';
    
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return {
    formatSeconds,
    formatSecondsReadable,
    formatSecondsToHoursMinutes,
    formatCountdown
  };
}