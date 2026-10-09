import { useCoursesStore } from "@/features/courses/store/useCoursesStore";
import { useFile } from "@/features/file-uploading/useFile";
import { useTestStore } from "@/shared/stores/testsStore/testsStore";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export function useTeacherCourse() {
  // Реактивная ссылка на массив файлов в localStorage
  const files = ref([]);
  const inputRef = ref(null);
  const title = ref(null);
  const description = ref(null);
  const subject = ref(null);
  const studentsClass = ref(null);
  const coursesStore = useCoursesStore();
  const testStore = useTestStore();
  const router = useRouter();

  const { currentCourseTests, studentCourses } = storeToRefs(coursesStore);
  const { tests } = storeToRefs(testStore);

  const isValid = computed(() =>
    Boolean(title.value && description.value && subject.value && files.value),
  );

  const { uploadFile } = useFile(inputRef);

  const upload = async () => {
    let file = await uploadFile();
    files.value?.push(file);
    inputRef.value = null;
  };

  const createCourse = async () => {
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("description", description.value);
    formData.append("subject", subject.value);

    files.value.forEach((file) => {
      formData.append("files", file);
    });

    await coursesStore.createCourse(formData);

    title.value = null;
    description.value = null;
    subject.value = null;
    studentsClass.value = null;
    files.value = null;
    inputRef.value = null;

    router.push({ name: "teacher-courses" });
  };

  const remove = (file) => {
    const idx = files.value.indexOf(file);

    if (idx > -1) {
      files.value.splice(idx, 1);
    }
  };

  const getCourseById = async (id) => {
    const response = await coursesStore.getCourseById(id);
    const materials = await coursesStore.fetchCourseMaterials(id);
    tests.value = await coursesStore.fetchCourseTests(id);

    title.value = response.title;
    description.value = response.description;
    subject.value = response.subject;
    files.value =
      materials?.map((material) => ({
        name: material.title,
        ...material,
      })) || [];
  };

  const updateCourse = async (id) => {
    const data = {
      title: title.value,
      description: description.value,
      subject: subject.value,
    };

    if (inputRef.value.files.length > 0) {
      await coursesStore.uploadCourseMaterials(id, inputRef.value.files[0]);
    }

    await coursesStore.updateCourse(id, data);
    router.push({ name: "teacher-courses" });
  };

  const removeTest = async (id) => {
    await testStore.deleteTest(id);
    const idx = currentCourseTests.value.findIndex((item) => item.id === id);

    currentCourseTests.value.splice(idx, 1);
  };

  const removeCourse = async (id) => {
    await coursesStore.removeCourse(id);
    const idx = studentCourses.value.findIndex((item) => item.id === id);
    
    studentCourses.value.splice(idx, 1);
  };

  const cancel = () => {
    title.value = null;
    description.value = null;
    subject.value = null;
    studentsClass.value = null;
    files.value = null;
    inputRef.value = null;
    router.push({ name: "home" });
  };

  return {
    files, // реактивная ссылка, которую можно использовать в шаблоне
    inputRef,
    title,
    description,
    subject,
    studentsClass,
    isValid,
    currentCourseTests,
    tests,
    upload,
    remove,
    createCourse,
    removeCourse,
    getCourseById,
    updateCourse,
    removeTest,
    cancel,
  };
}
