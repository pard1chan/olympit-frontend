<script setup>
import { Button, Container, Dropdown } from '@/shared/ui';
import { EXAM_SIMULATIONS_DROPDOWNS } from './lib';
import { useExam } from './model/composables/useExam';
import ExamPreStartInfo from './ui/ExamPreStartInfo.vue';
import { ERRORS } from './model/constants/Errors';

const { subject, duration, difficulty, error, createExam, exam, isValid, startExamAndGetQuestions, loading } = useExam()

const valueMap = {
  subject: subject,
  difficulty: difficulty,
  duration: duration
};
</script>

<template>
  <Container>
    <div class="exam-simulation-setup">
      <div class="exam-simulation-setup__dropdowns">
        <Dropdown v-for="(dropdown, idx) in EXAM_SIMULATIONS_DROPDOWNS" :items="dropdown.dropdownElements"
          :placeholder="dropdown.placeholder" v-model="valueMap[dropdown.id].value" :key="dropdown.id" />
        <Button @click="createExam" label="Создать" :disabled="!isValid"/>
      </div>
      <ExamPreStartInfo v-if="!Array.isArray(exam)" :exam="exam" @start="startExamAndGetQuestions" :error="ERRORS[error]" />
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.exam-simulation-setup {
  display: grid;
  row-gap: 20px;

  &__dropdowns {
    display: flex;
    gap: 40px;

    @include mobile {
      flex-direction: column;
    }
  }

}
</style>