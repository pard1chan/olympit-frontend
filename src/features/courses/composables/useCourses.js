import { computed, onMounted, ref } from "vue";
import { useCoursesStore } from "../store/useCoursesStore";
import { storeToRefs } from "pinia";
import { getFilterOptions } from "../lib/filter";
import { useCourseFilters } from "./useCourseFilters";
import { useRoute } from "vue-router";

export function useCourses(type) {
  const coursesStore = useCoursesStore();
  const { courses, studentCourses } = storeToRefs(coursesStore);

  const selectedFilter = ref("all");
  const filterOptions = computed(() => getFilterOptions(type));

  const coursesList = computed(() =>
    type === "all" ? courses : studentCourses,
  );

  const { filteredCourses, filtersWithCounts } = useCourseFilters(
    coursesList.value,
    filterOptions,
    selectedFilter,
    type,
  );

  const route = useRoute();


  onMounted(async () => {
    if (route.name === "student-aviable-courses") {
      await coursesStore.fetchCourses();
    } else {
      await coursesStore.fetchStudentCourses();
    }
  });

  return {
    fetchCourses: coursesStore.fetchCourses,
    fetchStudentCourses: coursesStore.fetchStudentCourses,

    // Data
    courses,
    studentCourses,

    // Filter state
    selectedFilter,
    filterOptions: filtersWithCounts,
    filteredCourses,
  };
}
