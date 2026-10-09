<template>
  <div class="option-input">
    <div class="option-input__field">
      <input
        :value="option.text"
        @input="$emit('update:option', { ...option, text: $event.target.value })"
        type="text"
        placeholder="Текст варианта"
        class="form-input"
      />
    </div>
    <div class="option-input__correct">
      <label v-if="questionType === 'single'">
        <input
          type="radio"
          :checked="option.isCorrect"
          @change="$emit('update:option', { ...option, isCorrect: true })"
        />
        Правильный
      </label>
      <label v-else-if="questionType === 'multiple'">
        <input
          type="checkbox"
          :checked="option.isCorrect"
          @change="$emit('update:option', { ...option, isCorrect: $event.target.checked })"
        />
        Правильный
      </label>
    </div>
    <button type="button" class="option-input__remove" @click="$emit('remove')">×</button>
  </div>
</template>

<script setup>
defineProps({
  option: { type: Object, required: true },
  questionType: { type: String, required: true }
});
defineEmits(['update:option', 'remove']);
</script>

<style scoped>
.option-input {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.option-input__field {
  flex: 1;
}
.option-input__field .form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
}

.option-input__correct {
  min-width: 90px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.option-input__correct label {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.option-input__remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0 0.2rem;
}
.option-input__remove:hover {
  color: #e53e3e;
}

/* ===== Адаптация OptionInput ===== */

@media (max-width: 768px) {
  .option-input {
    gap: 0.5rem;
  }

  .option-input__correct {
    min-width: 70px;
  }
}

@media (max-width: 480px) {
  .option-input {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .option-input__field {
    flex: 0 0 100%;
    order: 1;
  }

  .option-input__correct {
    flex: 1;
    min-width: auto;
    order: 2;
    justify-content: flex-start;
  }

  .option-input__correct label {
    font-size: 0.85rem;
  }

  .option-input__remove {
    order: 3;
    font-size: 1.2rem;
    padding: 0.5rem;
  }
}
</style>