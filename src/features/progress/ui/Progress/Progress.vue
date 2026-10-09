<template>
  <div class="progress block">
    <Container>
      <div class="progress__title h2">Ваш Прогресс</div>
      <ul v-if="subjects" class="progress__list">
        <li v-for="progressItem in limitedSubjects"  :key="progressItem.subject" class="progress__item">
          <ProgressChart  :chart-data="progressItem" :size="160" show-percentage />
        </li>
      </ul>
    </Container>
  </div>
</template>

<script setup>
import ProgressChart from '../ProgressChart/ProgressChart.vue';
import { Container } from '@/shared/ui';
import { computed } from 'vue';

const props = defineProps({
  subjects: Array,
  maxDisplay: {
    type: Number,
    default: 5
  }
})


const limitedSubjects = computed(() => props.subjects.slice(0, props.maxDisplay))
</script>

<style scoped lang="scss">
.progress {
  &__title {
    margin-bottom: fluid(30, 20);

    @include mobile {
      text-align: center;
    }
  }

  &__list {
    --gridTemplateColumns: 5;

    display: grid;
    gap: 20px;
    grid-template-columns: repeat(var(--gridTemplateColumns), 1fr);

    @include tablet {
      --gridTemplateColumns: 2;
    }

    @include mobile {
      --gridTemplateColumns: 1;
    }
  }
}
</style>