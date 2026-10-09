<script setup>
import CourseTests from '../CourseTests/CourseTests.vue';
import CourseMaterialsList from './CourseMaterialsList.vue';

const props = defineProps({
  course: Object,
  materials: Array,
  tests: Array
})
</script>

<template>
  <div class="course-materials">
    <div class="course-materials__title h1 block">{{ course.title }}</div>
    <div class="course-materials__lists block">
      <CourseMaterialsList v-if="materials" title="Материалы курса" :items="materials" />
      <CourseTests v-if="tests" :tests />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-materials {
  display: flex;
  flex-direction: column;
  gap: 20px 0;


  &__lists {
    display: flex;
    flex-direction: column;
    gap: 20px 0;

    max-height: 315px;
    overflow-y: scroll;
  }
}
</style>