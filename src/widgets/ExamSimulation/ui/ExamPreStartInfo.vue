<template>
  <div class="exam-info block" v-if="exam">
    <div class="exam-info__field">
      Предмет: <div class="exam-info__field-name">{{ SUBJECTS[exam.subject] }}</div>
    </div>
    <div class="exam-info__field">
      Длительность: <div class="exam-info__field-name">{{ DURATION[exam.duration] }}</div>
    </div>
    <div class="exam-info__field">
      Сложность: <div class="exam-info__field-name">{{ DIFFICULTIES[exam.difficulty] }}</div>
    </div>
    <Button @click="$emit('start', exam.id)" label="Начать" />
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { DURATION, SUBJECTS, DIFFICULTIES } from '@/shared/constants';
import { Button } from '@/shared/ui';
defineProps({
  exam: Object,
  error: String
})
</script>

<style lang="scss" scoped>
.exam-info {
  display: grid;
  row-gap: 10px;

  @include tablet-above {
    max-width: 300px;
  }

  &__field {
    display: flex;
    align-items: center;
    column-gap: 5px;

    &-name {
      font-weight: bold;
    }
  }
}
</style>