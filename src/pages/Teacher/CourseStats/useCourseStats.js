import { useCoursesStore } from "@/features/courses/store/useCoursesStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

export function useCourseStats() {
  const coursesStore = useCoursesStore()
  const { studentCourses, currentCourse } = storeToRefs(coursesStore)

  const stats = ref(null)

  const getStats = async (id) => {
    const response = await coursesStore.fetchCourseStats(id)
    stats.value = response
  }



  return {
    studentCourses,
    currentCourse,
    stats,
    fetchCourses: coursesStore.fetchStudentCourses,
    getCourseById: coursesStore.getCourseById,
    getStats
  }
}