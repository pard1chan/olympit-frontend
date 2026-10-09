import { onMounted, ref } from "vue";
import { usersApi } from "../api/users.api";

export function useUsers(type) {
  const error = ref(null);
  const isLoading = ref(false);
  const students = ref([]);

  const getStudents = async () => {
    isLoading.value = true;

    try {
      const response = await usersApi.fetchStudents();
      students.value = response;
      return response;
    } catch (err) {
      error.value = err;
      console.log(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // onMounted(async () => {
  //   if (type === 'students') await getStudents()
  // })

  return {
    error,
    isLoading,
    students,

    getStudents,
  };
}
