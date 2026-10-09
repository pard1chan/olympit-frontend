import { defineStore } from "pinia";
import { ref } from "vue";
import { notificationApi } from "../api/notificationApi";
import { usersApi } from "@/features/users/model/api/users.api";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { tokenManager } from "@/shared/lib/tokens";
import { isLocalTestToken } from "@/shared/config/localTestUsers";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const students = ref(null);
  const toasts = useToasts();

  async function fetchNotifications() {
    isLoading.value = true;
    error.value = null;

    try {
      if (isLocalTestToken(tokenManager.getAccessToken())) {
        notifications.value = [];
        return [];
      }

      const response = await notificationApi.fetchNotifications();
      notifications.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function markAsRead(id) {
    isLoading.value = true;
    error.value = null;

    const notification = notifications.value.find((item) => item.id === id);

    if (notification) return;

    try {
      await notificationApi.markAsRead(id);
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function createNotification(data) {
    isLoading.value = true;
    error.value = null;
    try {
      await notificationApi.createNotifications(data);
      toasts.success("Уведомление успешно отправлено!");
    } catch (errors) {
      error.value = errors;
      toasts.error('Уведомление не отправлено!')
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await usersApi.fetchStudents();
      students.value = response.map(({ nickname, id }) => ({
        label: nickname,
        value: id,
      }));
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    notifications,
    isLoading,
    error,
    students,
    fetchNotifications,
    markAsRead,
    fetchUsers,
    createNotification,
  };
});
