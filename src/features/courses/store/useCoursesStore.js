import { ref } from "vue";
import { defineStore } from "pinia";
import { coursesApi } from "../api/courses.api";
import { useToasts } from "@/shared/lib/composables/useToasts";

export const useCoursesStore = defineStore("courses", () => {
  const courses = ref(null);
  const currentCourse = ref(null);
  const studentCourses = ref(null);
  const studentCourseProgress = ref(null);
  const currentCourseTests = ref(null);
  const currentCourseMaterials = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const toasts = useToasts();

  async function fetchCourses() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.fetchAllcourses();
      courses.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchStudentCourses() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.fetchStudentCourses();
      studentCourses.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function subscribeOnCourse(id) {
    isLoading.value = true;
    error.value = null;

    try {
      await coursesApi.subscribeOnCourse(id);

      const courseResponse = await coursesApi.getCourseById(id);

      if (
        courseResponse &&
        !studentCourses.value?.some((course) => course.id === courseResponse.id)
      ) {
        if (!studentCourses.value) {
          studentCourses.value = [];
        }

        studentCourses.value.push(courseResponse);
      }

      toasts.success("Вы успешно записались на курс!");
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function getCourseById(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.getCourseById(id);
      currentCourse.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCourseTests(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.fetchCourseTests(id);
      currentCourseTests.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCourseMaterials(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.fetchCourseMaterials(id);
      currentCourseMaterials.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCourseProgress(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.fetchCourseProgress(id);
      const lessonsProgress =
        response.lessonsTotal > 0
          ? (response.lessonsDone / response.lessonsTotal) * 100
          : 0;
      const testsProgress =
        response.testsTotal > 0
          ? (response.testsDone / response.testsTotal) * 100
          : 0;

      studentCourseProgress.value =
        response.testsTotal > 0
          ? [
              {
                progress: response.progress,
                subject: "Общий прогресс",
              },
              {
                progress: testsProgress,
                subject: "Выполнено тестов",
              },
              {
                progress: lessonsProgress,
                subject: "Изучено материалов",
              },
            ]
          : [
              {
                progress: response.progress,
                subject: "Общий прогресс",
              },

              {
                progress: lessonsProgress,
                subject: "Изучено материалов",
              },
            ];
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function createCourse(data) {
    try {
      const result = await coursesApi.createCourse(data);
      toasts.success("Курс успешно создан!");
      return result;
    } catch (err) {
      error.value = err;
      toasts.error("При создании курса произошла ошибка! Повторите попытку");
      throw err;
    }
  }

  async function removeCourse(id) {
    try {
      const result = await coursesApi.deleteCourse(id);
      toasts.success("Курс успешно удален!");

      return result;
    } catch (err) {
      error.value = err;
      toasts.error("При удалении курса произошла ошибка! Повторите попытку");
      throw err;
    }
  }

  async function updateCourse(id, data) {
    try {
      const result = await coursesApi.updateCourse(id, data);
      toasts.success("Курс успешно обновлен!");
      return result;
    } catch (err) {
      error.value = err;
      toasts.error("При обновлении курса произошла ошибка! Повторите попытку");
      throw err;
    }
  }
  async function uploadCourseMaterials(id, data) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.uploadCourseMaterials(id, data);
      currentCourseMaterials.value.push(response);
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCourseStats(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await coursesApi.getCourseStatistics(id);
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    courses,
    studentCourses,
    currentCourse,
    currentCourseTests,
    currentCourseMaterials,
    studentCourseProgress,
    isLoading,
    error,
    fetchCourses,
    fetchStudentCourses,
    subscribeOnCourse,
    getCourseById,
    fetchCourseTests,
    fetchCourseMaterials,
    fetchCourseProgress,
    createCourse,
    removeCourse,
    updateCourse,
    uploadCourseMaterials,
    fetchCourseStats,
  };
});
