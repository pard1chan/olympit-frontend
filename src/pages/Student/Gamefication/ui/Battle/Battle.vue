<script setup>
import Test from '@/widgets/Test/test.vue';
import { useGame } from '../../model/composables/useGame';

const { giveAnswer, finishBattleAndSendAnswers, clear, nextQuestion, prevQuestion, battle, userAnswers, results, duration, currentQuestionIndex } = useGame()


</script>

<template>
  <Test 
    :answers="userAnswers"
    :idx="currentQuestionIndex"
    :results="results"
    :duration="duration"
    is-battle
    @answer="giveAnswer"
    @finish="finishBattleAndSendAnswers(battle.id)"
    @clear-data="clear"
    @next-question="nextQuestion"
    @complete="finishBattleAndSendAnswers(battle.id)"
   />
</template>