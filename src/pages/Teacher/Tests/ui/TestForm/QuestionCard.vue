<template>
  <div class="question-card">
    <div class="question-card__header">
      <span class="question-card__index">Вопрос {{ index + 1 }}</span>
      <button type="button" class="question-card__remove" @click="$emit('remove')">×</button>
    </div>

    <div class="question-card__body">
      <!-- Текст вопроса -->
      <div class="form-group">
        <label :for="`question-text-${question.id}`">Текст вопроса</label>
        <textarea
          :id="`question-text-${question.id}`"
          :value="question.question"
          @input="updateText($event.target.value)"
          rows="2"
          placeholder="Введите текст вопроса"
          class="form-textarea"
        ></textarea>
      </div>

      <!-- Тип ответа -->
      <div class="form-group">
        <label :for="`question-type-${question.id}`">Тип ответа</label>
        <select
          :id="`question-type-${question.id}`"
          :value="question.type"
          @change="updateType($event.target.value)"
          class="form-select"
        >
          <option value="single">Один вариант из нескольких</option>
          <option value="multiple">Несколько из нескольких</option>
          <option value="text">Текстовый ответ</option>
        </select>
      </div>

      <!-- Баллы -->
      <div class="form-group form-group--inline">
        <label :for="`question-points-${question.id}`">Баллы</label>
        <input
          :id="`question-points-${question.id}`"
          :value="question.points"
          @input="updatePoints($event.target.value)"
          type="number"
          min="1"
          class="form-input form-input--small"
        />
      </div>

      <!-- Варианты ответов (для типов с вариантами) -->
      <div v-if="isChoiceType" class="question-card__options">
        <div class="options-header">
          <span class="options-title">Варианты ответа</span>
          <button type="button" class="btn-add-option" @click="addOption">+ Добавить вариант</button>
        </div>
        <div v-for="(option, optIndex) in question.answers" :key="option.id" class="option-row">
          <OptionInput
            :option="option"
            :question-type="question.type"
            @update:option="updateOption(optIndex, $event)"
            @remove="removeOption(optIndex)"
          />
        </div>
      </div>

      <!-- Текстовый правильный ответ -->
      <div v-if="isTextType" class="form-group">
        <label :for="`correct-answer-${question.id}`">Правильный ответ</label>
        <input
          :id="`correct-answer-${question.id}`"
          :value="question.correctAnswer"
          @input="updateCorrectAnswer($event.target.value)"
          type="text"
          placeholder="Введите правильный ответ"
          class="form-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import OptionInput from './OptionInput.vue';

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true }
});

const emit = defineEmits(['update:question', 'remove']);

// Вспомогательная функция для создания нового объекта вопроса
const emitUpdated = (updater) => {
  const updated = { ...props.question };
  updater(updated);
  emit('update:question', updated);
};

const updateText = (text) => emitUpdated(q => { q.question = text; });
const updateType = (type) => emitUpdated(q => { q.type = type; });
const updatePoints = (points) => emitUpdated(q => { q.points = Number(points); });
const updateCorrectAnswer = (answer) => emitUpdated(q => { q.correctAnswer = answer; });
const updateRequired = (required) => emitUpdated(q => { q.required = required; });

const addOption = () => {
  emitUpdated(q => {
    if (!q.answers) q.answers = [];
    q.answers.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      text: '',
      order: 0,
      isCorrect: false
    });
  });
};

const updateOption = (index, newOption) => {
  emitUpdated(q => {
    q.answers[index] = newOption;
  });
};

const removeOption = (index) => {
  emitUpdated(q => {
    q.answers.splice(index, 1);
  });
};

const isChoiceType = computed(() => ['single', 'multiple'].includes(props.question.type));
const isTextType = computed(() => props.question.type === 'text');
</script>

<style scoped>
/* стили остаются без изменений */
</style>

<style scoped>
.question-card {
  background: #f9fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.question-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #edf2f7;
  border-bottom: 1px solid #e2e8f0;
}

.question-card__index {
  font-weight: 600;
  color: #4a5568;
}

.question-card__remove {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #a0aec0;
  cursor: pointer;
}
.question-card__remove:hover {
  color: #e53e3e;
}

.question-card__body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.9rem;
}

.form-textarea,
.form-input,
.form-select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
}

.form-input--small {
  width: 80px;
}

.form-group--inline {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.form-group--inline label {
  margin-bottom: 0;
}

.form-group--checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.question-card__options {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #cbd5e0;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.options-title {
  font-weight: 500;
  color: #2d3748;
}

.btn-add-option {
  background: none;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-add-option:hover {
  background: #667eea;
  color: white;
}

.option-row {
  margin-bottom: 0.8rem;
}

/* ===== Адаптация QuestionCard ===== */

/* Планшеты (до 768px) */
@media (max-width: 768px) {
  .question-card__header {
    padding: 0.75rem 1rem;
  }

  .question-card__body {
    padding: 1rem;
  }

  .form-group--inline {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

/* Мобильные устройства (до 480px) */
@media (max-width: 480px) {
  .question-card__header {
    padding: 0.5rem 0.75rem;
  }

  .question-card__index {
    font-size: 0.9rem;
  }

  .question-card__remove {
    font-size: 1.3rem;
  }

  .question-card__body {
    padding: 0.75rem;
  }

  .form-group label {
    font-size: 0.85rem;
  }

  .form-textarea,
  .form-input,
  .form-select {
    padding: 0.5rem 0.6rem;
    font-size: 0.9rem;
  }

  .form-group--inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .form-input--small {
    width: 100%;
  }

  .options-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .btn-add-option {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
  }
}
</style>