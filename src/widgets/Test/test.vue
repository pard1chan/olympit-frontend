<script setup>
import { TestHeader, TestQuestionsList, TestResults } from '@/features/test';
import { useTest } from '@/features/test/composables/useTest';
import { Container } from '@/shared/ui';
import { watch } from 'vue';

const props = defineProps({
  test: Object,
  status: String,
  duration: Number,
  answers: Array,
  idx: Number,
  isBattle: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['finish', 'next', 'answer', 'complete', 'clearData', 'nextQuestion', 'prev'])

const {   
  currentQuestion, 
  isLastQuestion, 
  testLength,
  currentQuestionIndex,
  goToQuestion,
  results
} = useTest()

watch(() => props.idx, (newIndex) => {
  if (newIndex !== undefined && newIndex !== currentQuestionIndex.value) {
    currentQuestionIndex.value = newIndex
    goToQuestion(newIndex)
  }
}, { immediate: true })

// Handle answer
const handleAnswer = (answerData) => {
  emit('answer', answerData)
}

const handleTimerComplete = () => {
  if (props.isBattle) {
    isLastQuestion.value ? emit('complete') : emit('nextQuestion')
  } else emit('complete')
}
</script>

<template>
  <Container>
    <div class="test-passing">
      <template v-if="results?.status !== 'complete'">
        <TestHeader 
          @finish="$emit('finish')" 
          @complete="handleTimerComplete"
          :duration 
          :testLength 
          :questionIndex="idx"
          :is-battle="isBattle"
        />
      <TestQuestionsList
        :current-question="currentQuestion"
        :is-last-question="isLastQuestion"
        :questionIndex="currentQuestionIndex"
        :is-battle="isBattle"
        :answers="answers"
        @prev="emit('prev')"
        @next="emit('nextQuestion')" 
        @answer="handleAnswer"
       />
      </template>
      <TestResults :results :answers @clear-data="emit('clearData')" v-else/>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.test-passing {
  display: grid;
  row-gap: 20px;
}
</style>