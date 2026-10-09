<script setup>
import { onMounted, provide } from 'vue';
import CourseForm from '../ui/CourseForm.vue';
import CourseMaterialsUploading from '../ui/CourseMaterialsUploading.vue';
import { useTeacherCourse } from '../composables/useTeacherCourse';
import { useRoute, useRouter } from 'vue-router';
import TestsList from '../../Tests/ui/TestsList.vue';

const course = useTeacherCourse()
const route = useRoute()
const router = useRouter()


provide('course', course)
onMounted(async () => {
  await course.getCourseById(route.params.id)
})
</script>

<template>
  <div class="course-update container">
    <CourseForm class="course-update__form" />
    <CourseMaterialsUploading class="course-update__uploud" @update="course.updateCourse(route.params.id)" />
    <TestsList class="course-update__tests" @edit="router.push({ name: 'test-update', params: { id: $event } })"
      @delete="course.removeTest($event)" :tests="course.currentCourseTests" />
  </div>
</template>

<style lang="scss" scoped>
.course-update {
  --gridTemplateColumns: 2;

  display: grid;
  gap: 20px;
  grid-template-columns: repeat(var(--gridTemplateColumns), 1fr);
  grid-template-areas:
    "form uploud"
    "tests tests"
  ;

  &__form {
    grid-area: form;
  }

  &__uploud {
    grid-area: uploud;
  }

  &__tests {
    grid-area: tests;
  }

  @include tablet {
    --gridTemplateColumns: 1;

    grid-template-areas: 
    "form"
    "uploud"
    "tests"
    ;
  }
}
</style>