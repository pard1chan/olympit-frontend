<script setup>
import { computed } from 'vue';
import { Button, Grid, GridItem } from '@/shared/ui';
import { COURSE_ITEM_CONFIG } from './configs/courseItem.config';
import CourseItemProgressLine from './CourseItemProgressLine/CourseItemProgressLine.vue';
import { useCourse } from '@/features/courses/composables/useCourse';


const props = defineProps({
  courseItem: Object,
  type: {
    type: String,
    default: 'all'
  },
  role: {
    type: String,
    default: 'student'
  },
})

const { subscribe, hasCourse, pushToCoursePage, transformCourseSubject, transformCourseStatus } = useCourse()

const emits = defineEmits(['update', 'remove'])

const buttonLabel = computed(() => {
  const courseId = props.courseItem.id;
  
  // Проверяем, записан ли пользователь на курс
  const isEnrolled = hasCourse(courseId);
  
  // Если не записан — всегда "записаться"
  if (!isEnrolled) return 'записаться';
  
  // Получаем прогресс по курсу (например, из стора или из props.courseItem.progress)
  const progress = props.courseItem.progress // или props.courseItem.progress
  
  // Если прогресс больше 0 — "продолжить", иначе "начать"
  return progress > 0 ? 'продолжить' : 'начать';
});
const buttonMethod = computed(() =>
  hasCourse(props.courseItem.id)
    ? () => pushToCoursePage(props.courseItem.id)
    : () => subscribe(props.courseItem.id)
);
</script>

<template>
  <div class="course-item block">
    <Grid 
      :columns="COURSE_ITEM_CONFIG.columns" 
      :rows="COURSE_ITEM_CONFIG.rows" 
      :gap="COURSE_ITEM_CONFIG.gap"
      :template-areas="COURSE_ITEM_CONFIG.gridAreas" 
      :mobile-breakpoint="COURSE_ITEM_CONFIG.mobileBreakpoint"
      :mobile-gap="COURSE_ITEM_CONFIG.mobileGap"
      :mobile-columns="COURSE_ITEM_CONFIG.mobileColumns" 
      :mobile-template-columns="COURSE_ITEM_CONFIG.mobileTemplateColumns"
      :mobile-rows="COURSE_ITEM_CONFIG.mobileRows"
      :mobile-template-rows="COURSE_ITEM_CONFIG.mobileTemplateRows"
      :mobile-template-areas="COURSE_ITEM_CONFIG.mobileGridAreas">

      <GridItem area="title" mobile-area="title">
        <div class="course-item__title h2">{{ courseItem.title }}</div>
      </GridItem>

      <GridItem area="btn" mobile-area="btn" class="justify-end">
        <Button v-if="role === 'student'" @click="buttonMethod" class="course-item__btn" :label="buttonLabel" full />
        <div v-else class="buttons">
          <Button @click="emits('update', courseItem.id)" label="редактировать" mode="action"/> 
          <Button  label="удалить" @click="emits('remove',  courseItem.id)" mode="danger"/> 
        </div>
      </GridItem>

      <template v-if="type === 'all'">
        <GridItem>
          <div v-if="role === 'teacher'">Дата создания: {{ new Date(courseItem.createdAt).toLocaleDateString('ru-Ru') }}</div>
          <div v-if="role === 'student'">{{ transformCourseSubject(courseItem.subject) }}</div>
        </GridItem>
        <GridItem v-if="role === 'student'" area="progress" align-self="center">
          <p>{{ courseItem.description }}</p>
        </GridItem>
      </template>

      <template v-else>
        <GridItem v-if="role === 'student'" area="status" mobile-area="status">
          <div class="course-item__status h6">{{ transformCourseStatus(courseItem) }}</div>
        </GridItem>
        <GridItem v-if="role === 'student'" area="progress" align-self="center">
          <CourseItemProgressLine :progress="courseItem.progress" show-label height="12px" :animated="false" />
        </GridItem>
      </template>
    </Grid>
  </div>
</template>

<style lang="scss" scoped>
.course-item {
  transition-duration: var(--transition-duration);

  @include hover {
    translate: 0 -5px;
  }
}

.justify-end {
  @include mobile-above {
    justify-self: end !important;
  }
}

.buttons {
  display: flex;
  column-gap: 10px;
}
</style>