<template>
  <button type="button" class="add-question-btn" @click="$emit('add')">
    <span class="add-icon">+</span> Добавить вопрос
  </button>
</template>

<script setup>
defineEmits(['add']);
</script>

<style scoped>
.add-question-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.add-question-btn:hover {
  background: #edf2f7;
  border-color: #667eea;
  color: #667eea;
}
.add-icon {
  font-size: 1.5rem;
  line-height: 1;
}

/* ===== Адаптация AddQuestionButton ===== */

@media (max-width: 768px) {
  .add-question-btn {
    padding: 0.8rem;
    font-size: 0.95rem;
  }

  .add-icon {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .add-question-btn {
    padding: 0.7rem;
    font-size: 0.9rem;
  }

  .add-icon {
    font-size: 1.2rem;
  }
}
</style>