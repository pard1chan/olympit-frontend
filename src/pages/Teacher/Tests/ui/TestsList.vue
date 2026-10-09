<template>
  <div class="tests block">
    <div class="tests__header">
      <h2 class="tests__title">Тесты</h2>
      <router-link class="tests__add-btn" :to="{ name: 'test-create' }">
        <span class="add-icon">+</span> Добавить тест
      </router-link>
    </div>

    <div v-if="tests && tests.length" class="tests__grid">
      <article v-for="test in tests" :key="test.id" class="test-card">
        <div class="test-card__content">
          <h3 class="test-card__title">{{ test.title }}</h3>
          <p class="test-card__description">Дата создания: {{ new Date(test.createdAt).toLocaleDateString() }}</p>
        </div>
        <div class="test-card__actions">
          <button class="test-card__btn test-card__btn--edit" @click="$emit('edit', test.id)" title="Редактировать">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button class="test-card__btn test-card__btn--delete" @click="$emit('delete', test.id)" title="Удалить">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </article>
    </div>

    <div v-else-if="tests === null || tests.length === 0" class="tests__empty">
      <p>У вас пока нет тестов.</p>
      <router-link :to="{ name: 'test-create' }" class="tests__empty-link">Создать первый тест</router-link>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

// defineProps({
//   tests: {
//     type: Array,
//     default: null
//   }
// });

const { currentCourseTests: tests } = inject('course')

defineEmits(['delete', 'edit']);
</script>

<style lang="scss" scoped>
.tests {

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: var(--color-pink);
    color: white;
    border-radius: 40px;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.2s;

    .add-icon {
      font-size: 1.2rem;
      line-height: 1;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;

    max-height: 200px;
    overflow-y: auto;
  }

  &__empty {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 16px;
    color: #64748b;

    p {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    &-link {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background: #e2e8f0;
      color: #334155;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;

      &:hover {
        background: #cbd5e1;
      }
    }
  }
}

.test-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  &__content {
    padding: 1.5rem;
    flex: 1;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 0.5rem 0;
  }

  &__description {
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    gap: 1rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  &__questions {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .meta-icon {
      width: 1.1rem;
      height: 1.1rem;
    }
  }

  &__actions {
    display: flex;
    border-top: 1px solid #e9eef2;
  }

  &__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: none;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    &--edit {
      color: #3b82f6;
      border-right: 1px solid #e9eef2;

      &:hover {
        background: #eff6ff;
        color: #2563eb;
      }
    }

    &--delete {
      color: #ef4444;

      &:hover {
        background: #fef2f2;
        color: #dc2626;
      }
    }
  }
}
</style>