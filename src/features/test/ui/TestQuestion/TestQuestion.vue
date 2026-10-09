<script setup>
import { useLocalStorage } from '@/shared/lib/composables/useLocalStorage';
import { Field, Input } from '@/shared/ui';
import { computed } from 'vue';

const { useStorage } = useLocalStorage();
const props = defineProps({
  question: Object,
    answers: Array, 
});

// const answers = useStorage('answers'); // реактивный массив ответов
const emit = defineEmits(['answer']);

// Находим сохранённый ответ для текущего вопроса
const savedAnswer = computed(() => {
  return props.answers?.find(ans => ans.questionId === props.question.question.id);
});

// Проверка, выбран ли конкретный вариант в зависимости от типа вопроса
const isAnswerChecked = (answer) => {
  const saved = savedAnswer.value;
  if (!saved) return false;

  if (props.question.question.type === 'single') {
    return saved.answerIds === answer.id;
  }
  if (props.question.question.type === 'multiple') {
    return saved.answerIds?.includes(answer.id);
  }
  return false;
};

// Обработка одиночного выбора
const handleSingleChange = (answer) => {
  emit('answer', {
    questionId: props.question.question.id,
    type: 'single',
    text: answer.text,
    isCorrect: answer.isCorrect,
    answerIds: answer.id,
  });
};

// Обработка множественного выбора (накопление)
const handleMultipleChange = (answer, checked) => {
  const saved = savedAnswer.value;
  let answerIds = saved?.type === 'multiple' ? [...(saved.answerIds || [])] : [];

  if (checked) {
    if (!answerIds.includes(answer.id)) answerIds.push(answer.id);
  } else {
    answerIds = answerIds.filter(id => id !== answer.id);
  }

  emit('answer', {
    questionId: props.question.question.id,
    isCorrect: answer.isCorrect,
    type: 'multiple',
    answerIds,
  });
};

// Текстовый ответ
const savedText = computed(() => {
  return savedAnswer.value?.type === 'text' ? savedAnswer.value.text : '';
});

const handleTextChange = (text) => {
  emit('answer', {
    questionId: props.question.question.id,
    type: 'text',
    text,
  });
};
</script>

<template>
  <div class="test-question">
    <div class="test-question__title h2">{{ question.question.question }}</div>

    <!-- Single choice -->
    <ul v-if="question.question.type === 'single'" class="test-question__answers-list">
      <li
        v-for="answer in question.answers"
        :key="answer.id"
        :class="['test-question__answers-item', { 'is-active': isAnswerChecked(answer) }]"
      >
        <label :for="`answer-${answer.id}`">
          <input
            type="radio"
            name="single-answer"
            :id="`answer-${answer.id}`"
            :checked="isAnswerChecked(answer)"
            @change="handleSingleChange(answer)"
          />
          {{ answer.text }}
        </label>
      </li>
    </ul>

    <!-- Multiple choice -->
    <ul v-else-if="question.question.type === 'multiple'" class="test-question__answers-list">
      <li
        v-for="answer in question.answers"
        :key="answer.id"
        :class="['test-question__answers-item', { 'is-active': isAnswerChecked(answer) }]"
      >
        <label :for="`answer-${answer.id}`">
          <input
            type="checkbox"
            :id="`answer-${answer.id}`"
            :checked="isAnswerChecked(answer)"
            @change="handleMultipleChange(answer, $event.target.checked)"
          />
          {{ answer.text }}
        </label>
      </li>
    </ul>

    <!-- Text answer -->
    <ul v-else class="test-question__answers-list">
      <li class="test-question__answers-item">
        <Input
        mode="transparent"
          name="answer"
          placeholder="Напишите ответ"
          type="textarea"
          :modelValue="savedText"
          @update:modelValue="handleTextChange"
        />
      </li>
    </ul>
  </div>
</template>


<style lang="scss" scoped>
.test-question {
  display: flex;
  flex-direction: column;
  row-gap: 40px;

  &__answers-list {
    display: flex;
    flex-direction: column;
    gap: fluid(20, 15) 0;
  }

  &__answers-item {

    &.is-active {
      font-weight: 600;
    }

    label {
      display: flex;
      align-items: center;
      column-gap: 10px;
    }

    input {
      margin: 0;
    }

    @include hover {
      opacity: .8;
    }
  }
}
</style>