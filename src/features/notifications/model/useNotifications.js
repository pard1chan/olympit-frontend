import { storeToRefs } from "pinia";
import { useNotificationsStore } from "../store/useNotificationsStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export const useNotifications = (limit) => {
  const notificationsStore = useNotificationsStore();
  const { notifications, isLoading, error, students } =
    storeToRefs(notificationsStore);

  const recieverId = ref(null);
  const title = ref(null);
  const message = ref(null);
  const date = ref(null);
  const router = useRouter()
  const maxHeight = computed(() => `${Math.min(limit * 100, 600)}px`);

  const isValid = computed(
    () => title.value && message.value && recieverId.value,
  );

  const send = async () => {
    await notificationsStore.createNotification({
      userId: recieverId.value,
      title: title.value,
      message: message.value,
    });
    message.value = null;
    recieverId.value = null;
    title.value = null;
    date.value = null;
  };

  const cancel = () => {
    message.value = null;
    recieverId.value = null;
    title.value = null;
    date.value = null;

    router.push({ name: 'home' })
  };


  return {
    notifications,
    isLoading,
    error,
    maxHeight,
    recieverId,
    title,
    message,
    date,
    students,
    isValid,

    markAsRead: notificationsStore.markAsRead,
    createNotification: notificationsStore.createNotification,
    fetchNotifications: notificationsStore.fetchNotifications,
    fetchSstudent: notificationsStore.fetchUsers,
    send,
    cancel
  };
};
