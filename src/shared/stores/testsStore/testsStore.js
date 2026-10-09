import { testApi } from "@/shared/api";
import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { defineStore } from "pinia";
import { ref } from "vue";

const localStorage = useLocalStorage();

export const useTestStore = defineStore("tests", () => {
  // State (ref/reactive)
  const questions = localStorage.useStorage("questions");
  const tests = ref(null);
  const results = ref(null);
  const duration = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const userAnswers = localStorage.useStorage("answers");
  const toasts = useToasts();

  // Actions
  async function getTestsBySubject(subject) {
    loading.value = true;
    error.value = null;
    try {
      const tests = await testApi.getTestsBySubject(subject);
      return tests;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getTestByCourse(courseId) {
    loading.value = true;
    error.value = null;
    try {
      const tests = await testApi.getTestByCourse(id);
      return tests;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createTest(data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await testApi.createTest(data);
      toasts.success("Тест успешно создан!");
      return response;
    } catch (err) {
      error.value = err;
      toasts.error("Ошибка при создании теста, повторите попытку!");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTest(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await testApi.deleteTest(id);
      toasts.success("Тест успешно удален!");
      return response;
    } catch (err) {
      error.value = err;
      toasts.error("Ошибка при удалении теста, повторите попытку!");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getTestById(id) {
    loading.value = true;
    error.value = null;
    try {
      const test = await testApi.getTestById(id);
      return test;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTest(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const test = await testApi.updateTest(id, data);
      toasts.success("Тест успешно обновлен!");
      return test;
    } catch (err) {
      error.value = err;
      toasts.error("Ошибка при обновлении теста, повторите попытку!");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function addQuestion(id, data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await testApi.addQuestionToTest(id, data);
      return response;
    } catch (err) {
      error.value = err;
      toasts.error("Ошибка, повторите попытку!");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function giveAnswer(answer) {
    localStorage.addItem("answers", answer, "questionId");
  }

  async function sendAnswers(id, answers) {
    loading.value = true;
    error.value = null;

    try {
      const response = await testApi.finishTest(id, answers);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    localStorage.clearItems("answers");
    localStorage.clearItems("questions");
    results.value = null;
  }

  // Возвращаем всё для использования
  return {
    error,
    questions,
    userAnswers,
    results,
    tests,

    // State
    getTestById,
    getTestByCourse,
    getTestsBySubject,
    giveAnswer,
    sendAnswers,
    clear,
    createTest,
    deleteTest,
    addQuestion,
    updateTest,

    // Getters

    // Actions
  };
});
