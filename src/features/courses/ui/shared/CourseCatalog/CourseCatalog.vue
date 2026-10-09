<script setup>
import { useCourses } from '@/features/courses/composables/useCourses';
import { Empty } from '@/shared/ui';
import CourseItem from '../CourseItem/CourseItem.vue';
import CoursesDropdown from '../CoursesDropdown/CoursesDropdown.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'all'
  },
  role: {
    type: String,
    default: 'student'
  },
  filters: {
    type: Boolean,
    default: true
  }
})

const { selectedFilter, filteredCourses, filterOptions } = useCourses(props.type)
const emits = defineEmits(['update', 'remove'])

</script>

<template>
  <div class="course-catalog">
    <div class="course-catalog__inner">
      <CoursesDropdown v-if="role === 'student' && filters" v-model="selectedFilter" :items="filterOptions"
        class="course-catalog__dropdown" />
      <ul v-if="filteredCourses.length" class="course-catalog__list">
        <li class="course-catalog__item" v-for="courseItem in filteredCourses">
          <CourseItem @update="emits('update', $event)" @remove="emits('remove', $event)" :role="role" :type="type"
            :course-item="courseItem" />
        </li>
      </ul>
      <Empty v-else text="У вас нет курсов!" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-catalog {

  &__inner {
    display: grid;
    row-gap: 25px;
  }

  &__dropdown {
    @include mobile-above {
      justify-self: end;
      width: 256px;
    }
  }

  &__list {
    display: grid;
    row-gap: 15px;
  }
}
</style>