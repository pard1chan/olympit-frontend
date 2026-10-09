<template>
  <div class="course-materials-list">
    <div class="h2">{{ title }}</div>
    <ul class="course-materials-list__list">
      <CourseMaterialsItem 
        v-for="material in items" 
        :key="material.fileUrl" 
        :material-id="material.id"
        :course-id="material.courseId" 
        :link="material.fileUrl"
        :title="material.title" 
        />
    </ul>
  </div>
</template>

<script setup>
import CourseMaterialsItem from './CourseMaterialsItem.vue';

defineProps({
  title: String,
  items: Array
})
</script>

<style lang="scss" scoped>
.course-materials-list {
  display: flex;
  flex-direction: column;
  gap: 20px 0;

  &__list {
    display: flex;
    flex-direction: column;
    gap: fluid(20, 15) 0;
  }
}
</style>