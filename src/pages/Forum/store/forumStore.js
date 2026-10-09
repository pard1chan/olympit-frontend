import { defineStore } from "pinia";
import { ref } from "vue";
import { forumApi } from "../api/forum.api";

export const useForumStore = defineStore("forum", () => {
  const thread = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchAllThreads(limit = null) {
    loading.value = true;
    error.value = null;

    try {
      const response = await forumApi.fetchAllThreads(limit);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getThreadById(id, limit, offset = 0) {
    loading.value = true;
    error.value = null;

    try {
      const response = await forumApi.getThreadById(id, { limit, offset });
      thread.value = response;
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createThread(data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await forumApi.createThread(data);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeThread(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await forumApi.removeThread(id);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function sendMessage(id, data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await forumApi.sendMessage(id, data);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    thread,
    loading,
    error,
    // Actions
    fetchAllThreads,
    getThreadById,
    createThread,
    sendMessage,
    removeThread
  };
});
