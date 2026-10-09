import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";
import { ref, watch } from "vue";

export function useExamStorage() {
  const STORAGE_KEY = "exam";
  const storage = useLocalStorage({ maxItems: 1 });
  const savedExam = ref(storage.getItems(STORAGE_KEY).length === 0 ? null : storage.getItems(STORAGE_KEY));

  
  watch(
    savedExam,
    (newExam) => {
      if (newExam) {
        storage.setItems(STORAGE_KEY, newExam);
      }
    },
    { deep: true },
  );

  const setExam = (examData) => {
    const examToSave = {
      ...examData,
      savedAt: new Date().toISOString(),
      // Store timer data if available
      // timer: examData.timer || {
      //   startTime: Date.now(),
      //   duration: examData.duration,
      //   elapsed: examData.elapsed || 0,
      // },
    };

    savedExam.value = examToSave;
    
    return examToSave;
  };

  const updateExam = () => {
    const elapsedSeconds = Math.floor(
      (Date.now() - testStartTime.value) / 1000,
    );
    const remainingSeconds = Math.max(0, seconds - elapsedSeconds);

    savedExam.value.timer.elapsed = remainingSeconds;
    setExam(savedExam.value);
  };

  const clearExam = () => {
    localStorage.removeItem(STORAGE_KEY)
  };

  const loadExam = () => {
    savedExam.value = storage.getItems(STORAGE_KEY);
    return savedExam.value;
  };

  return {
    setExam,
    loadExam,
    updateExam,
    savedExam,
    clearExam
  };
}
