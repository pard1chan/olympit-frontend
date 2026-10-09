import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";
import { ref, watch } from "vue";

export function useGameStorage() {
  const STORAGE_KEY = "battle";
  const storage = useLocalStorage({ maxItems: 1 });
  const battle = ref(storage.getItems(STORAGE_KEY).length === 0 ? null : storage.getItems(STORAGE_KEY));

  
  watch(
    battle,
    (newBattle) => {
      if (newBattle) {
        storage.setItems(STORAGE_KEY, newBattle);
      }
    },
    { deep: true },
  );

  const setBattle = (data) => {
    const battleToSave = {
      ...data,
      savedAt: new Date().toISOString(),
    };

    battle.value = battleToSave;
    
    return examToSave;
  };

  const updateBattle = () => {
    const elapsedSeconds = Math.floor(
      (Date.now() - testStartTime.value) / 1000,
    );
    const remainingSeconds = Math.max(0, seconds - elapsedSeconds);

    savedExam.value.timer.elapsed = remainingSeconds;
    setExam(savedExam.value);
  };

  const clearBattle = () => {
    localStorage.clear(STORAGE_KEY)
  };

  const loadBattle = () => {
    savedExam.value = storage.getItems(STORAGE_KEY);
    return savedExam.value;
  };

  return {
    battle,
    setBattle,
    updateBattle,
    clearBattle,
    loadBattle
  };
}
