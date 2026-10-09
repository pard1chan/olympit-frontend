import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";
import { useTestStore } from "@/shared/stores/testsStore/testsStore";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";

export function getRandomTestId(testInfo) {
  if (!testInfo || testInfo.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * testInfo.length);
  return testInfo[randomIndex]?.id ?? null;
}

export const useTest = () => {
  const currentQuestionIndex = ref(0);
  const score = ref(0);
  const testName = ref(null)

  const testStore = useTestStore();
  const localStorage = useLocalStorage();

  const { error, questions, userAnswers, results } = storeToRefs(testStore);

  // Computed property for current question
  const currentQuestion = computed(() => {
    if (questions.value && questions.value.length > 0) {
      return questions.value[currentQuestionIndex.value];
    }
    return null;
  });

  const testLength = computed(() => questions.value.length);

  // Check if this is the last question
  const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === questions.value?.length - 1;
  });

  // Move to next question
  const nextQuestion = () => {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
    }
  };

  function getRandomTestId(testInfo) {
    if (!testInfo || testInfo.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * testInfo.length);
    return testInfo[randomIndex]?.id ?? null;
  }

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };

  // Jump to specific question
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.value.length) {
      currentQuestionIndex.value = index;
    }
  };

  // Reset test
  const resetTest = () => {
    currentQuestionIndex.value = 0;
  };

  const setScore = (results) => {
    score.value = results;
  };

  const submitTest = async (id) => {
    const ans = userAnswers.value.map(({ questionId, text }) => ({
      questionId,
      answer: text,
    }));

    const payload = {
      answers: [...ans],
    };
    const response = await testStore.sendAnswers(id, payload);

    results.value = {
      score: response.score,
      testName: testName.value,
      status: "complete",
    };
  };

  const getTestById = async (id) => {
    const test = await testStore.getTestById(id);
    testName.value = test.test.title
    localStorage.setItems("questions", test.questions);
  };

  const getTestQuestionBySubject = async (subject) => {
    const testInfo = await testStore.getTestsBySubject(subject);
    if (!testInfo) return null;

    const randomId = getRandomTestId(testInfo);

    const response = await testStore.getTestById(randomId);
    localStorage.setItems("questions", response.questions);
    return response;
  };

  return {
    // State
    currentQuestionIndex,
    questions,
    score,
    testLength,
    error,
    // test,
    userAnswers,
    results,

    // Getters
    currentQuestion,
    isLastQuestion,

    // Actions
    nextQuestion,
    prevQuestion,
    goToQuestion,
    resetTest,
    setScore,
    getTestById,
    giveAnswer: testStore.giveAnswer,
    sendAnswer: testStore.sendAnswers,
    clear: testStore.clear,

    getTestQuestionBySubject,
    submitTest,
  };
};
