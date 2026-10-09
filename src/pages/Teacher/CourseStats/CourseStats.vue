<script setup>
import { Dropdown, Empty } from '@/shared/ui';
import { useCourseStats } from './useCourseStats';
import { computed, onMounted, ref } from 'vue';
import StatBlock from './ui/StatBlock.vue';
import { StatsAverIcon, StatsDoneIcon, StatsStartedIcon, StatsUserIcon } from '@/shared/ui/Icons';
import CourseItemProgressLine from '@/features/courses/ui/shared/CourseItem/CourseItemProgressLine/CourseItemProgressLine.vue';

const { getStats, fetchCourses, studentCourses, stats } = useCourseStats()


const items = computed(() => {
  if (!studentCourses.value) return

  return studentCourses.value.map((item) => ({
    label: item.title,
    value: item.id
  }))
})

const completionPercentage = computed(() => {
  return stats.value?.totalStudents > 0
    ? Math.round((stats.value?.completedCount / stats.value?.totalStudents) * 100)
    : 0;
})


onMounted(fetchCourses)
</script>

<template>
  <div class="course-stats container">
    <Dropdown v-if="studentCourses" @open="fetchCourses" @change="getStats" :items="items" />

    <h2>Общие показатели</h2>

    <div v-if="stats" class="course-stats__blocks">
      <StatBlock title="Всего учеников" :icon="StatsUserIcon" :num="stats.totalStudents" />
      <StatBlock title="Начали курс" :icon="StatsStartedIcon" :num="stats.inProgressCount" />
      <StatBlock title="Всего учеников" :icon="StatsDoneIcon" :num="stats.totalStudents" />
      <StatBlock title="Средний балл" :icon="StatsAverIcon" :num="stats.averageProgress" />
    </div>

    <Empty v-else text="У вас пока нет курсов" />

    <!-- <CourseItem v-if="stats" :course-item="item" type="all" role="student" /> -->
    <div v-if="stats" class="item block">
      <h2>Прогресс завершения курса</h2>
       <CourseItemProgressLine :progress="completionPercentage" show-label/>
       <span>
        {{ stats.completedCount }} из {{ stats.totalStudents }} учеников завершили курс
       </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-stats {
  --gridTemplateColumns: 4;

  display: grid;
  row-gap: 20px;

  &__blocks {
    display: grid;
    grid-template-columns: repeat(var(--gridTemplateColumns), 1fr);
    gap: 20px;


    @include tablet {
      --gridTemplateColumns: 2;
    }

    @include mobile {
      --gridTemplateColumns: 1;
    }
  }


}
</style>