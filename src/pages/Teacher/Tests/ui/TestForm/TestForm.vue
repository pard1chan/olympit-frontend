<template>
  <div class="test-form container">
    <h2 class="test-form__title">Создание теста</h2>

    <!-- Основная информация о тесте -->
    <div class="test-form__meta">
      <div class="form-group">
        <label for="test-title">Название теста</label>
        <input
          id="test-title"
          v-model="testMeta.title"
          type="text"
          placeholder="Введите название"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="test-description">Проходной балл</label>
        <input
          id="test-description"
          v-model="testMeta.passThreshold"
          rows="3"
          placeholder="60"
          class="form-textarea"
          type="number"
        />
      </div>
    </div>

    <!-- Список вопросов -->
    <div class="test-form__questions">
      <h3 class="test-form__subtitle">Вопросы</h3>
      <transition-group name="question-list" tag="div" class="questions-list">
        <QuestionCard
          v-for="(question, index) in testMeta.questions"
          :key="question.id"
          v-model:question="testMeta.questions[index]"
          :index="index"
          @remove="removeQuestion(index)"
        />
      </transition-group>
      <AddQuestionButton @add="addQuestion" />
    </div>

    <!-- Кнопки сохранения -->
    <div class="test-form__actions">
      <button type="button" class="btn btn--primary" @click="saveTest">Сохранить тест</button>
      <button type="button" class="btn btn--secondary" @click="previewTest">Отмена</button>
    </div>
  </div>
</template>

<script setup>
import QuestionCard from './QuestionCard.vue';
import AddQuestionButton from './AddQuestionButton.vue';
import { useTestForm } from '../../composables/useTeacherTests';

// Вся логика теперь в composable
const {
  testMeta,
  addQuestion,
  removeQuestion,
  saveTest,
  previewTest
} = useTestForm();
</script>

<style scoped lang="scss">
.test-form {
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.test-form__title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.test-form__meta {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
}

.test-form__subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #333;
}

.questions-list {
  margin-bottom: 1.5rem;
}

.question-list-enter-active,
.question-list-leave-active {
  transition: all 0.3s ease;
}
.question-list-enter-from,
.question-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.test-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &--primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a67d8;
    }
  }

  &--secondary {
    background: #e2e8f0;
    color: #333;

    &:hover {
      background: #cbd5e0;
    }
  }
}

/* ===== Адаптация ===== */

/* Планшеты (до 768px) – соответствует @include tablet */
@media (max-width: 768px) {
  .test-form {
    padding: 1.5rem;
  }

  .test-form__title {
    font-size: 1.75rem;
    margin-bottom: 1.2rem;
  }

  .test-form__meta {
    margin-bottom: 1.5rem;
  }

  .test-form__subtitle {
    font-size: 1.3rem;
  }
}

/* Мобильные устройства (до 480px) – соответствует @include mobile */
@media (max-width: 480px) {
  .test-form {
    padding: 1rem;
    border-radius: 12px;
  }

  .test-form__title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .form-input,
  .form-textarea {
    padding: 0.6rem 0.8rem;
    font-size: 0.95rem;
  }

  .test-form__subtitle {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .test-form__actions {
    flex-direction: column;
    gap: 0.8rem;

    .btn {
      width: 100%;
      padding: 0.7rem 1rem;
    }
  }
}
</style>