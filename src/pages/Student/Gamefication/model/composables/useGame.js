import { storeToRefs } from "pinia";
import { useGameStore } from "../store/gameStore";
import { computed, ref } from "vue";
import { useTest } from "@/features/test/composables/useTest";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { useRouter } from "vue-router";

export function useGame() {
  const gameStore = useGameStore();
  const toasts = useToasts();
  const router = useRouter();
  const { battle, loading, error } = storeToRefs(gameStore);
  const {
    getTestQuestionBySubject,
    questions,
    giveAnswer,
    userAnswers,
    sendAnswer,
    results,
    nextQuestion,
    prevQuestion,
    currentQuestionIndex,
  } = useTest();

  const subject = ref(null);
  const testId = ref(null);
  const duration = ref(20);



  const students = ref(null);

  const getTest = async () => {
    const response = await getTestQuestionBySubject(subject.value);

    if (!response) {
      questions.value = null
      localStorage.removeItem('questions')
      // toasts.warning('Битвы по выбранному предмету пока недоступны!')
      return;
    }

    questions.value = response.questions;
    testId.value = response.test.id;
  };

  const createBattle = async () => {
    if (!testId.value) {
      toasts.warning("Битвы по этому предмету пока не доступны!");
      return;
    }

    await gameStore.createBattle({
      subject: subject.value,
      testId: testId.value,
      user2Id: "fb8eaac9-3efc-49b5-b995-98deecd19204",
    });

    const battle = await gameStore.startBattle();
    router.push({ name: "gamification-battle", params: { id: battle.id } });
  };

  const clear = () => {
    gameStore.clear();
    localStorage.removeItem("battle");
  };

  const finishBattleAndSendAnswers = async (id) => {
    const ans = userAnswers.value.map((item) => {
      return {
        questionId: item.questionId,
        answer: item.text,
      };
    });

    const payload = {
      answers: [...ans],
    };

    const response = await sendAnswer(battle.value.testId, payload);

    const winner = computed(() => {
      if (response.winnerId === response.user1Id) return 'Вы победили!'
      else if (response.winnerId === response.user2Id) return 'Вы проиграли'
      else return 'Ничья'
    })

    results.value = {
      score: response.score,
      subject: battle.value.subject,
      status: "complete",
      winner
    };

    await gameStore.finishBattle(id);
    localStorage.removeItem("answers");
    localStorage.removeItem("questions");
  };

  return {
    battle,
    subject,
    loading,
    error,
    questions,
    userAnswers,
    results,
    duration,
    currentQuestionIndex,
    students,

    getBattleById: gameStore.getBattleById,
    createBattle,
    startBattle: gameStore.startBattle,
    finishBattle: gameStore.finishBattle,
    getTest,
    giveAnswer,
    clear,
    finishBattleAndSendAnswers,
    nextQuestion,
    prevQuestion,
  };
}
