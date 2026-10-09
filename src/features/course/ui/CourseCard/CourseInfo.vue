<template>
  <div class="course-info">
    <div class="course-info__title h1">{{ title }}</div>
    <div class="course-info__description h5">{{ description }}</div>

    <div class="course-info__counts">
      <div class="course-info__count">
        <IconVideoCount />
        Видеоуроков в курсе:
        {{ videosCount || 'Отсутствуют' }}
      </div>
      <div class="course-info__count">
        <IconTestsCount />
        Тестов в курсе:
        {{ testsCount || 'Отсутствуют' }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { IconTestsCount, IconVideoCount } from '@/shared/ui/Icons';

defineProps({
  title: String,
  description: String,
  videosCount: Number,
  testsCount: Number
})
</script>

<style lang="scss" scoped>
.course-info {
  display: flex;
  flex-direction: column;
  gap: 20px 0;

  @include mobile {}

  &__counts {
    display: flex;
    flex-direction: column;
    gap: 10px 0;
  }

  &__count {
    display: flex;
    align-items: center;
    gap: 0 5px;
  }
}
</style>