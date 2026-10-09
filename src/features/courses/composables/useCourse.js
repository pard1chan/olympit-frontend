import { useCoursesStore } from "../store/useCoursesStore";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { computed, onUnmounted } from "vue";
import { SUBJECTS, STATUSES } from "@/shared/constants";

export function useCourse() {
  const router = useRouter();
  const route = useRoute();
  const coursesStore = useCoursesStore();

  const { currentCourse, studentCourses, currentCourseTests, currentCourseMaterials, studentCourseProgress } = storeToRefs(coursesStore);

  const hasCourse = (courseId) => studentCourses.value?.find(el => {
    return el.id === courseId
  })
  
  const transformCourseSubject = (subject) => {
    return SUBJECTS[subject];
  };

  const transformCourseStatus = (courseItem) => {
    if (courseItem.progress === 100) return STATUSES.complited
    return STATUSES[courseItem.status];
  };

  const pushToCoursePage = (id) => {
    router.push({ name: "course", params: { id } });
  };


  const getCourseById = async () => {
    const id = route.params.id;
    const course = await coursesStore.getCourseById(id);
    await coursesStore.fetchCourseProgress(id)
    await coursesStore.fetchCourseTests(id)
    await coursesStore.fetchCourseMaterials(id)
     
    return course;
  };

  const courseTestsCount = computed(() => currentCourseTests.value?.length || 0)
  const courseMaterialsCount = computed(() => currentCourseMaterials.value?.length || 0)


  onUnmounted(() => {
    currentCourse.value = null
    currentCourseMaterials.value = null
    studentCourseProgress.value = null
  })

  return {
    subscribe: coursesStore.subscribeOnCourse,
    getCourseById,
    currentCourseTests,
    currentCourseMaterials,
    transformCourseSubject,
    transformCourseStatus,
    pushToCoursePage,
    currentCourse,
    hasCourse,
    courseTestsCount,
    courseMaterialsCount,
    studentCourseProgress
  };
}
