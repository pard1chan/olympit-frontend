import { defineStore } from "pinia";
import { ref } from "vue";
import { gameApi } from "../api/game.api";
import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";

export const useGameStore = defineStore("game", () => {
  const localStorage = useLocalStorage();

  const battle = localStorage.useStorage("battle");
  const battles = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  async function createBattle(data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await gameApi.createBattle(data);
      battle.value = response;
      localStorage.setItems('battle', battle.value)
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getBattleById(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await gameApi.getBattleById(id);
      battle.value = response;
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startBattle() {
    loading.value = true;
    error.value = null;

    try {
      const response = await gameApi.startBattle(battle.value.id);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function finishBattle(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await gameApi.finishBattle(id, battle.value);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    battle.value = null;
  }

  return {
    // State
    battle,
    loading,
    error,
    status,
    // Actions
    getBattleById,
    createBattle,
    startBattle,
    finishBattle,
    clear,
  };
});
