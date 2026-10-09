<script setup>
import { CourseCatalog } from '@/features/courses/ui';
import { useTeacherCourse } from './composables/useTeacherCourse';

const { removeCourse } = useTeacherCourse()
</script>

<template>
  <div class="courses container">
    <router-link class="link" :to="{ name: 'courses-stat' }">Статистика по курсам</router-link>
    <CourseCatalog @update="$router.push({ name: 'courses-update', params: { id: $event } })" @remove="removeCourse"
    type=""
      role="teacher" />
  </div>
</template>

<style lang="scss" scoped>
.courses {
  display: grid;
  row-gap: 20px;
}
</style>