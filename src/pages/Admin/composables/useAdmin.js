import { onMounted, ref } from "vue";
import { adminApi } from "../api/admin.api";
import { useToasts } from "@/shared/lib/composables/useToasts";

export function useAdmin() {
  const systemStats = ref(null);
  const courses = ref(null);
  const users = ref(null);
  const isLoading = ref(false);
  const err = ref(null);

  const toasts = useToasts();

  const getSystemStats = async () => {
    isLoading.value = true;
    err.value = null;
    try {
      systemStats.value = await adminApi.fetchStats();
    } catch (error) {
      console.log(error);
      err.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const getCourses = async () => {
    isLoading.value = true;
    err.value = null;
    try {
      courses.value = await adminApi.fetchCourses();
    } catch (error) {
      console.log(error);
      err.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const getUsers = async () => {
    isLoading.value = true;
    err.value = null;
    try {
      users.value = await adminApi.fetchUsers();
    } catch (error) {
      console.log(error);
      err.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const removeCourse = async (id) => {
    isLoading.value = true;
    err.value = null;
    try {
      await adminApi.removeCourse(id);
      const idx = courses.value.findIndex((item) => item.id === id);
      courses.value.splice(idx, 1);
      toasts.success("Курс успешно удален!");
    } catch (error) {
      console.log(error);
      err.value = error;
      toasts.error("Ошибка при удалении курса, повторите попытку!");
    } finally {
      isLoading.value = false;
    }
  };

  const removeUser = async (id) => {
    isLoading.value = true;
    err.value = null;
    try {
      await adminApi.removeUser(id);
      const idx = users.value.findIndex((item) => item.id === id);
      users.value.splice(idx, 1);
      toasts.success("Пользователь успешно удален!");
    } catch (error) {
      console.log(error);
      err.value = error;
      toasts.error("Ошибка при удалении пользователя, повторите попытку!");
    } finally {
      isLoading.value = false;
    }
  };

  const blockUser = async (id) => {
    isLoading.value = true;
    err.value = null;
    try {
      await adminApi.blockUser(id);
      users.value.find((user) => {
        if (user.id === id) user.blocked = true;
      });
      toasts.success("Пользователь успешно заблокирован!");
    } catch (error) {
      console.log(error);
      err.value = error;
      toasts.error("Ошибка при блокировке пользователя, повторите попытку!");
    } finally {
      isLoading.value = false;
    }
  };

  const unBlockUser = async (id) => {
    isLoading.value = true;
    err.value = null;
    try {
      await adminApi.unBlockUser(id);
      users.value.find((user) => {
        if (user.id === id) user.blocked = false;
      });
      toasts.success("Пользователь успешно разблокирован!");
    } catch (error) {
      console.log(error);
      err.value = error;
      toasts.error("Ошибка при разблокировке пользователя, повторите попытку!");
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(getSystemStats);

  return {
    systemStats,
    isLoading,
    err,
    courses,
    users,

    getSystemStats,
    getCourses,
    removeCourse,
    getUsers,
    removeUser,
    blockUser,
    unBlockUser,
  };
}
