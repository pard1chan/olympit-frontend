<script setup lang="ts">
import { provide } from 'vue';
import { useTeacherCourse } from './composables/useTeacherCourse';
import CourseForm from './ui/CourseForm.vue';
import CourseMaterialsUploading from './ui/CourseMaterialsUploading.vue';

const course = useTeacherCourse()
provide('course', course)
</script>

<template>
  <div class="course-create container">
    <CourseForm />
    <CourseMaterialsUploading @create="course.createCourse" @cancel="course.cancel" />
  </div>
</template>

<style lang="scss" scoped>
.course-create {
  --gridTemplateColumns: 2;

  display: grid;
  gap: 20px;
  grid-template-columns: repeat(var(--gridTemplateColumns), 1fr);

  @include tablet {
    --gridTemplateColumns: 1;
  }
}
</style>