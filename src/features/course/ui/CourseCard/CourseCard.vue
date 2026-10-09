<script setup>
import { Button } from '@/shared/ui';
import CourseInfo from './CourseInfo.vue';

defineProps({
  course: Object,
  testCount: Array,
  materialsCount: Array,
})

</script>

<template>
  <div class="course-card block">
    <div class="course-card__top">
      <img src="/course.avif" alt="" class="course-card__img">
      <CourseInfo :title="course.title" :description="course.description" :videos-count="materialsCount?.length" :tests-count="testCount?.length" />
    </div>
    <!-- <Button full label="Начать" /> -->
  </div>
</template>

<style lang="scss" scoped>
.course-card {
  display: flex;
  flex-direction: column;
  gap: 20px 0;


  @include mobile {
      max-height: 190px;
  }

  &__img {
    @include square(fluid(200, 120));
    border-radius: var(--border-radius-m);

  }

  &__top {
    display: flex;
    align-items: center;
    gap: 0 20px;
  }
}
</style>