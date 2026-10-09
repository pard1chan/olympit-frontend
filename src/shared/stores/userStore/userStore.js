import { userApi } from "@/widgets/UserProfileCard/model/api/user.api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { tokenManager } from "@/shared/lib/tokens";
import {
  getLocalTestUserByToken,
  toLocalProfile,
} from "@/shared/config/localTestUsers";

export const useUserStore = defineStore("user", () => {
  // State (ref/reactive)
  const currentUser = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const cachedUsers = ref({});
  const userType = ref(null);

  // Getters (computed)
  const userFullName = computed(() => {
    if (!currentUser.value) return "";
    return `${currentUser.value.firstName || ""} ${currentUser.value.lastName || ""}`.trim();
  });

  const userInitials = computed(() => {
    if (!currentUser.value) return "";
    const first = currentUser.value.firstName?.[0] || "";
    const last = currentUser.value.lastName?.[0] || "";
    return (first + last).toUpperCase();
  });

  const userId = computed(() => currentUser.value?.userId);

  const hasAvatar = computed(() => !!currentUser.value?.avatarUrl);

  // Actions
  async function fetchCurrentUser() {
    loading.value = true;
    error.value = null;

    try {
      const localUser = getLocalTestUserByToken(tokenManager.getAccessToken());

      if (localUser) {
        const profile = toLocalProfile(localUser);
        currentUser.value = profile;
        userType.value = localUser.role;
        isAuthenticated.value = true;
        return profile;
      }

      const user = await userApi.fetchProfile();
      currentUser.value = user;
      isAuthenticated.value = true;
      return user;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserInfo() {
    loading.value = true;
    error.value = null;

    try {
      const response = await userApi.fetchUserInfo();
      userType.value = response.role;
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCurrentUser(data) {
    try {
      const updatedUser = await userApi.updateProfile(data);
      currentUser.value = { ...currentUser.value, ...updatedUser };
      return updatedUser;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }

  async function updateUserEmail(email) {
    try {
      const updatedUser = await userApi.updateEmail(email);
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUserAvatar(blob, onProgress = null) {
    try {
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const result = await userApi.updateAvatar(file, onProgress);
      if (currentUser.value) {
        currentUser.value.avatarUrl = result.avatarUrl || result.url;
      }
      return result;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }

  function setUser(user) {
    currentUser.value = user;
    isAuthenticated.value = !!user;
    error.value = null;
  }

  function clearUser() {
    currentUser.value = null;
    isAuthenticated.value = false;
    error.value = null;
  }

  async function fetchUserById(id) {
    if (cachedUsers.value[id]) {
      return cachedUsers.value[id];
    }

    try {
      const user = await userApi.fetchUser(id);
      cachedUsers.value[id] = user;
      return user;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      throw err;
    }
  }

  // Возвращаем всё для использования
  return {
    // State
    currentUser,
    isAuthenticated,
    loading,
    error,
    cachedUsers,
    userType,

    // Getters
    userFullName,
    userInitials,
    hasAvatar,
    userId,

    // Actions
    fetchCurrentUser,
    updateCurrentUser,
    updateUserEmail,
    updateUserAvatar,
    setUser,
    clearUser,
    fetchUserById,
    fetchUserInfo
  };
});
