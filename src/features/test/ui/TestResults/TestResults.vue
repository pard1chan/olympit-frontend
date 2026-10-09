<template>
  <div class="results block">
    <div v-if="results">
      <div class="results__header">
        <h2 class="results__title">Результаты</h2>
        <IconButton @click="close" :icon-component="IconClose" />
      </div>

      <div class="results__table">
        <div class="results__row">
          <template v-if="results.subject">
            <div class="results__label">Предмет</div>
            <div class="results__value">{{ SUBJECTS[results.subject] }}</div>
          </template>
          <template v-else>
            <div class="results__label">Тест</div>
            <div class="results__value">{{ results.testName }}</div>
          </template>
        </div>

        <div v-if="results.duration" class="results__row">
          <div class="results__label">Длительность</div>
          <div class="results__value">{{ DURATION[results.duration] }}</div>
        </div>

        <div class="results__row results__row--correct">
          <div class="results__label">Правильные ответы</div>
          <div class="results__value">{{ correctAnswers }}</div>
        </div>

        <div class="results__row results__row--err">
          <div class="results__label">Неправильные ответы</div>
          <div class="results__value">{{ incorrectAnswers }}</div>
        </div>

        <div class="results__row results__row--total">
          <div class="results__label">Итого баллов</div>
          <div class="results__value results__value--large">{{ results.score }}</div>
        </div>
        <div v-if="results.winner" class="results__row results__row--winner">
          <div class="results__label">Результаты</div>
          <div class="results__value results__value--large">{{ results.winner }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DURATION, SUBJECTS } from '@/shared/constants';
import IconButton from '@/shared/ui/IconButton';
import { IconClose } from '@/shared/ui/Icons';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTest } from '../../composables/useTest';

const props = defineProps({
  answers: Array,
  results: Object
})

const router = useRouter()
const { clear } = useTest()

const emits = defineEmits(['clearData'])

const close = () => {
  clear()
  emits('clearData')
  router.back()
}

const correctAnswers = computed(() => props.answers.filter(ans => ans.isCorrect).length)
const incorrectAnswers = computed(() => props.answers.filter(ans => !ans.isCorrect).length)
</script>

<style lang="scss" scoped>
.results {
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 28px;
  background: #f8f9fa; // Warm white
  border: 1px solid #faf3e8;

  display: grid;
  row-gap: 20px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 16px;
    border-bottom: 1px solid #f5ede1;
  }

  &__title {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  &__table {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;

    &:not(:last-child) {
      border-bottom: 1px solid #f8f2ea;
    }

    &--err {
      @include hover {
        background-color: #ff0a54;
        color: #fff;
      }
    }

    &--correct {
      @include hover {
        background: #2dc653;
        color: #fff;
      }


    }

    &--total {
      margin-top: 4px;
      border-bottom: none !important;

      .results__label,
      .results__value {
        color: #5c4e3d;
        font-weight: 500;
      }
    }
  }

  &__label {
    font-size: 15px;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__value {
    font-size: 17px;
    font-weight: 450;


    &--large {
      font-size: 22px;
      font-weight: 500;
    }
  }
}
</style>