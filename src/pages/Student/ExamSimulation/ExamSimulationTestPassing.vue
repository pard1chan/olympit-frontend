<script setup>
import { useExam } from '@/widgets/ExamSimulation/model/composables/useExam';
import Test from '@/widgets/Test/test.vue';

const {  exam, finishExam, giveAnswer, answers, clear, results, currentQuestionIndex, nextQuestion, prevQuestion } = useExam()
</script>

<template>
  <Test 
    :test="exam"
    :idx="currentQuestionIndex"
    :duration="exam?.duration" 
    :answers="answers"
    :results="results"
    @answer="giveAnswer(exam.id, $event)"
    @finish="finishExam(exam.id)"
    @complete="finishExam(exam.id)"
    @next-question="nextQuestion"
    @prev="prevQuestion"
    @clear-data="clear"
    />
</template>