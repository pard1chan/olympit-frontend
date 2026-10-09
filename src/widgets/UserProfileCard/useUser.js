import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { useAuthStore, useUserStore } from "@/shared/stores";

export const useProfile = (modal = null, options = {}) => {
  const { autoLoad = true } = options;

  const userStore = useUserStore();

  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  // Декомпозируем store с сохранением реактивности
  const {
    currentUser,
    loading,
    error,
    userFullName,
    userInitials,
    hasAvatar,
    userType,
  } = storeToRefs(userStore);

  const toast = useToasts();

  // Локальное состояние для компонента
  const localLoading = ref(false);
  const localError = ref(null);
  const isEditing = ref(false);

  // Форма редактирования
  const editForm = ref({
    firstName: "",
    email: "",
    class: "",
  });

  const avatar = computed(() => {
    if (!currentUser.value?.avatarUrl) return '/def.avif'; // or a default avatar
    return transformAvatarUrl(currentUser.value?.avatarUrl);
  });

  // Инициализация формы данными из store
  const initEditForm = () => {
    if (currentUser.value) {
      editForm.value = {
        firstName: currentUser.value.nickname || "",
        email: currentUser.value.email || "",
        class: currentUser.value.class || "",
      };
    }
  };

  const openModal = () => {
    isEditing.value = false;
    modal.value = true;
  };

  // Валидация формы
  const validateForm = () => {
    const errors = [];

    if (!editForm.value.email?.trim()) {
      errors.push("Email обязателен");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.value.email)) {
      errors.push("Неверный формат email");
    }

    if (!editForm.value.firstName?.trim()) {
      errors.push("Имя обязательно");
    }

    return errors;
  };

  // Сохранение профиля
  const saveProfile = async () => {
    // const errors = validateForm();
    // if (errors.length > 0) {
    //   localError.value = errors.join(", ");
    //   return { success: false, errors };
    // }

    localLoading.value = true;
    localError.value = null;

    try {
      const updatedUser = await userStore.updateCurrentUser(editForm.value);
      isEditing.value = false;
      toast.success("Профиль успешно обновлен!");
      return { success: true, data: updatedUser };
    } catch (err) {
      localError.value = err.message;
      return { success: false, error: err };
    } finally {
      localLoading.value = false;
    }
  };

  const updateAvatar = async (blob) => {
    await userStore.updateUserAvatar(blob);
  };

  const updateEmail = async (email) => {
    await userStore.updateUserEmail(email);
  };

  function transformAvatarUrl(url) {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    // If the URL is already absolute (starts with http:// or https://), return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a relative path, prepend the server URL
    // Remove leading slash if present to avoid double slash
    const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  }

  // Переключение режима редактирования
  const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
      initEditForm();
    }
  };

  // Загрузка профиля если нужно
  if (isAuthenticated.value) {
    if (autoLoad && !currentUser.value) {
      userStore.fetchCurrentUser().catch(console.error);
    }
  }

  // Автоматическая инициализация формы при загрузке пользователя
  watch(
    currentUser,
    (newUser) => {
      if (newUser && !isEditing.value) {
        initEditForm();
      }
    },
    { immediate: true },
  );

  // onMounted(userStore.fetchUserInfo)

  return {
    // Из store
    user: currentUser,
    isLoading: loading,
    storeError: error,
    userFullName,
    userInitials,
    hasAvatar,
    avatar,
    userType,

    // Локальное состояние
    localLoading,
    localError,
    isEditing,
    editForm,
    // Методы store
    fetchUser: () => userStore.fetchCurrentUser(),
    fetchUserInfo: () => userStore.fetchUserInfo(),
    clearUser: () => userStore.clearUser(),

    // Локальные методы
    saveProfile,
    toggleEdit,
    initEditForm,
    validateForm,
    transformAvatarUrl,
    updateAvatar,
    openModal,
  };
};
