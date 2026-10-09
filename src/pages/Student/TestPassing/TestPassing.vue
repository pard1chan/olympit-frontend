<script setup>
import { useTest } from '@/features/test/composables/useTest';
import Test from '@/widgets/Test/test.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';


const { getTestById, userAnswers, questions, currentQuestionIndex, results, giveAnswer, nextQuestion, prevQuestion , sendAnswer, submitTest, clear} = useTest()

const route = useRoute()

onMounted(async () => {
  await getTestById(route.params.id)
})
</script>

<template>
  <Test 
    :answers="userAnswers"
    :idx="currentQuestionIndex"
    :results="results"
    :duration="duration"
    @answer="giveAnswer"
    @finish="submitTest(route.params.id)"
    @clear-data="clear"
    @next-question="nextQuestion"
    @prev="prevQuestion"
   />
</template>