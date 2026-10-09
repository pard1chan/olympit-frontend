<template>
  <div class="courses container">
    <ul class="courses__list">
      <li class="courses__item block" v-for="course in courses" :key="course.id">
        <div class="courses__item-info">
          <div class="courses__item-date">
            Дата создания: {{ new Date(course.createdAt).toLocaleDateString() }}
          </div>
          <div class="courses__item-title h3">{{ course.title }}</div>
        </div>
        <div class="courses__item-buttons">
          <Button @click="removeCourse(course.id)" label="Удалить" mode="danger"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdmin } from './composables/useAdmin';
import { Button } from '@/shared/ui';

const { getCourses, removeCourse, courses } = useAdmin()

onMounted(getCourses)
</script>

<style lang="scss" scoped>
.courses {
  &__list {
    display: grid;
    row-gap: 20px;
    max-height: 80dvh;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-info {
      display: grid;
      row-gap: 10px;
    }
  }
}
</style>