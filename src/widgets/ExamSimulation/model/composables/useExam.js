import { computed, ref } from "vue";
import { useExamStore } from "../store/examStore";
import { storeToRefs } from "pinia";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { useRouter } from "vue-router";
import { useTest } from "@/features/test/composables/useTest";
import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";

export function useExam() {
  const examStore = useExamStore();
  const toasts = useToasts();
  const router = useRouter();

  const { exams, exam, loading, error } = storeToRefs(examStore);

  const localStorage = useLocalStorage();
  const {
    giveAnswer: saveAnswer,
    nextQuestion,
    prevQuestion,
    resetTest,
    clear,
    results,
    currentQuestionIndex,
    questions,
    userAnswers: answers,
  } = useTest();

  const difficulty = ref(null);
  const duration = ref(null);
  const subject = ref(null);

  const isValid = computed(() =>
    Boolean(difficulty.value && duration.value && subject.value),
  );

  const createExam = async () => {
    await examStore.createExam({
      duration: duration.value,
      difficulty: difficulty.value,
      subject: subject.value,
    });
    toasts.success("Экзамен успешно создан!");
  };

  const startExamAndGetQuestions = async (id) => {
    const exam = await examStore.startExam(id);

    if (!exam) return;

    const response = await examStore.getExamQuestions(id);

    if (response && questions.value) {
      questions.value = response.questions;
      localStorage.setItems("questions", questions.value);
      router.push({ name: "exam-simulation-test", params: { id } });
    }
  };

  // В useExam.js
  const sendAnswer = async (id, data) => {
    // data содержит поля: questionId, type, и дополнительные (answerId, answerIds, text)
    let payload;

    switch (data.type) {
      case "single":
        payload = {
          questionId: data.questionId,
          answerIds: [data.answerIds],
        };
        break;
      case "multiple":
        payload = {
          questionId: data.questionId,
          answerIds: data.answerIds,
        };
        break;
      case "text":
        payload = {
          questionId: data.questionId,
          answerText: data.text,
        };
        break;
      default:
        console.warn("Unknown answer type", data);
        return;
    }

    await examStore.giveAnswer(id, payload);
    saveAnswer(data); // сохраняем в localStorage через useTest
  };

  const finishExam = async (id) => {
    const exam = await examStore.finishExam(id);
    results.value = {
      subject: exam.subject,
      duration: exam.duration,
      score: exam.score,
      status: "complete",
    };
  };

  const clearData = () => {
    clear();
    examStore.clear();
  };

  return {
    exam,
    loading,
    error,
    questions,
    difficulty,
    duration,
    subject,
    answers,
    results,

    //store actions
    startExam: examStore.startExam,
    finishExam,
    getExamById: examStore.getExamById,
    createExam,
    clear: clearData,
    giveAnswer: sendAnswer,
    getQuestions: examStore.getExamQuestions,

    //local actions
    isValid,
    startExamAndGetQuestions,
    //test
    currentQuestionIndex,
    resetTest,
    nextQuestion,
    prevQuestion,
  };
}
