<script setup>
import { Button } from '@/shared/ui';
import { TestQuestion } from '..';

const props = defineProps({
  currentQuestion: Object,
  isLastQuestion: Boolean,
  questionIndex: Number,
  answers: Array,
  isBattle: {
    type: Boolean,
    default: false
  }
})

defineEmits(['next', 'prev', 'answer'])
</script>

<template>
  <div class="test-question-wrap block">
    <TestQuestion v-if="currentQuestion" :answers :question="currentQuestion" :type="currentQuestion.type" @answer="$emit('answer', $event)" />
    <div class="test-question-wrap__buttons">
      <Button v-if="questionIndex > 0 && !isBattle" @click="$emit('prev')" label="Назад" />
      <Button v-if="!isLastQuestion" @click="$emit('next')" class="end" label="Далее" />
    </div>
  </div>

</template>

<style lang="scss" scoped>
.test-question-wrap {
  display: grid;
  row-gap: 30px;


  &__buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.end {
  margin-left: auto;
}
</style>