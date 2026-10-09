<script setup>
import { Container } from '@/shared/ui';
import { onMounted } from 'vue';
import { useCourse } from '@/features/courses/composables/useCourse';
import Progress from '@/features/progress/ui';
import { CourseCard, CourseMaterials } from '@/features/course';



const { getCourseById, currentCourse, currentCourseMaterials, currentCourseTests, studentCourseProgress } = useCourse()

onMounted(getCourseById)
</script>

<template>
  <div v-if="currentCourse" class="course">
    <Container>
      <div class="course__inner">
        <CourseCard class="course__card" :course="currentCourse" :test-count="currentCourseTests"
          :materials-count="currentCourseMaterials" />
        <CourseMaterials class="course__materials" :course="currentCourse" :materials="currentCourseMaterials"
          :tests="currentCourseTests" />
        <Progress class="course__progress" :subjects="studentCourseProgress" />
      </div>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.course {
  --gridTemplateColumns: 2;

  &__inner {
    display: grid;
    grid-template-columns: repeat(var(gridTemplateColumns), 1fr);
    gap: 20px;
    grid-template-areas:
      'card materials'
      '. materials'
      'progress progress'
    ;

    @include tablet {
      grid-template-rows: repeat(2, 1fr);
      grid-template-areas:
        'card card'
        'materials materials'
        'progress progress'
      ;
    }

    @include mobile {
      --gridTemplateColumns: 1;

      grid-template-areas:
        'card'
        'materials'
        'progress'
      ;
    }
  }

  &__card {
    grid-area: card;
  }

  &__materials {
    grid-area: materials;
  }

  &__progress {
    grid-area: progress;
  }
}
</style>