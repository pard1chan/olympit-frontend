import { ref } from "vue";
import { examApi } from "@/widgets/ExamSimulation/model/api/exam.api";
import { defineStore } from "pinia";
import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";

export const useExamStore = defineStore("exam", () => {
  const localStorage = useLocalStorage();

  // State (ref/reactive)
  const exams = ref(null);
  const exam = localStorage.useStorage("exam");
  const loading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchUserExams() {
    loading.value = true;
    error.value = null;

    try {
      const exms = await examApi.getUserExams();
      exams.value = exms;
      return exms;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getExamById(id) {
    loading.value = true;
    error.value = null;

    try {
      const exm = await examApi.getExamById(id);
      exam.value = exm;
      return exm;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getExamQuestions(id) {
    loading.value = true;
    error.value = null;

    try {
      const exms = await examApi.getExamQuestions(id);
      return exms;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createExam(data) {
    loading.value = true;
    error.value = null;
    try {
      const exam = await examApi.createExam(data);
      localStorage.setItems("exam", exam);
      return exam;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startExam(id) {
    loading.value = true;
    error.value = null;
    try {
      const exam = await examApi.startExam(id);
      return exam;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function finishExam(id) {
    loading.value = true;
    error.value = null;
    try {
      const exam = await examApi.endExam(id);
      localStorage.clearItems("exam");
      return exam;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function giveAnswer(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const exam = await examApi.giveAnswer(id, data);
      return exam;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    exam.value = null;
    localStorage.clearItems("timer");
  }

  return {
    // State
    exam,
    exams,
    loading,
    error,
    // questions,

    // Actions
    fetchUserExams,
    getExamById,
    getExamQuestions,
    createExam,
    startExam,
    finishExam,
    giveAnswer,
    clear,
  };
});
