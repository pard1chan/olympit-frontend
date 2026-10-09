// composables/useTestForm.js (или в папке shared/lib/composables)
import { reactive } from "vue";
import { useTestStore } from "@/shared/stores/testsStore/testsStore";
import { useRoute, useRouter } from "vue-router";

export function useTestForm() {
  const testStore = useTestStore();

  const route = useRoute();
  const router = useRouter()

  // Типы вопросов
  const QuestionType = {
    SINGLE: "single", // один из нескольких
    MULTIPLE: "multiple", // несколько из нескольких
    TEXT: "text", // текстовый ответ
  };

  // Состояние формы
  const testMeta = reactive({
    title: "",
    courseId: route.params.id,
    passThreshold: "",
    questions: [],
  });

  // Генерация уникального id
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  // Добавить вопрос
  const addQuestion = () => {
    testMeta.questions.push({
      id: generateId(),
      question: "",
      type: QuestionType.SINGLE,
      answers: [], // для вариантов
      correctAnswer: "", // для текстового ответа
      points: 1,
      order: 0,
      required: true,
    });
  };

  // Удалить вопрос
  const removeQuestion = (index) => {
    testMeta.questions.splice(index, 1);
  };

  // Сохранить тест (через стор)
  const saveTest = async () => {
    try {
      await testStore.createTest(testMeta);
      testMeta.courseId = null;
      testMeta.passThreshold = null;
      testMeta.questions = null;
      testMeta.title = null;
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const getTestById = async (id) => {
    const test = await testStore.getTestById(id);
    testMeta.title = test.test.title;
    testMeta.passThreshold = test.test.passThreshold;
    // testMeta.questions = test.questions
  };

  const addQuestionToTest = async (id) => {
      testMeta.questions.forEach(async (q) => {
        await testStore.addQuestion(id, {
          question: q.question,
          type: q.type,
          points: q.points,
          order: q.order,
          answers: q.answers
        });
      });
  };

  const updateTest = async () => {
    await addQuestionToTest(route.params.id)
    await testStore.updateTest(route.params.id, {
      title: testMeta.title,
      passThreshold: testMeta.passThreshold,
    });
    router.push({ name: 'teacher-courses' })
  };

  // Предпросмотр (просто вывод в консоль)
  const previewTest = () => {
    router.push({ name: 'teacher-courses' })
  };

  return {
    testMeta,
    QuestionType,
    addQuestion,
    removeQuestion,
    saveTest,
    previewTest,
    deleteTest: testStore.deleteTest,
    getTestById,
    updateTest,
  };
}
