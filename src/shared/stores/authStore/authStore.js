import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "../../../widgets/AuthForm/model/api/auth.api";
import { useRouter } from "vue-router";
import { axiosBasic } from "@/shared/api/axiosInstance";
import { useUserStore } from "../userStore/userStore";
import {
  createLocalTestToken,
  findLocalTestUser,
  isLocalTestToken,
  toLocalProfile,
} from "@/shared/config/localTestUsers";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const router = useRouter();

    // State
    const token = ref(null);
    const refreshToken = ref(null);
    const userType = ref(null); // роль (student/teacher)
    const isLoading = ref(false);
    const error = ref(null);

    // Геттеры
    const isAuthenticated = computed(() => !!token.value);

    // Actions
    function setUserType(role) {
      userType.value = role;
    }

    async function login(credentials) {
      isLoading.value = true;
      error.value = null;

      try {
        const localUser = findLocalTestUser(credentials);

        if (localUser) {
          const localToken = createLocalTestToken(localUser);
          const userStore = useUserStore();

          token.value = localToken;
          refreshToken.value = localToken;
          userType.value = localUser.role;
          userStore.setUser(toLocalProfile(localUser));

          return {
            data: {
              role: localUser.role,
              tokens: {
                AccessToken: localToken,
                RefreshToken: localToken,
              },
            },
          };
        }

        const response = await axiosBasic.post("/auth/login", credentials);
        token.value = response.data.tokens.AccessToken;
        refreshToken.value = response.data.tokens.RefreshToken;
        userType.value = response.data.role;
        return response;
      } catch (err) {
        sessionStorage.removeItem("auth");
        error.value = "Неверный email или пароль";
        throw err;
      } finally {
        // error.value = null;
        isLoading.value = false;
      }
    }

    async function register(userData) {
      isLoading.value = true;
      error.value = null;

      try {
        const registrationData = {
          ...userData,
          role: userType.value,
        };

        const response = await axiosBasic.post(
          "/auth/register",
          registrationData,
        );
        token.value = response.data.tokens.AccessToken;
        refreshToken.value = response.data.tokens.RefreshToken;
        userType.value = response.data.role;
        return response;
      } catch (err) {
        error.value = "Ошибка регистрации";
        throw err;
      } finally {
        isLoading.value = false;
      }
    }

    async function refreshTokens() {
      if (!refreshToken.value) {
        throw new Error("No refresh token available");
      }

      try {
        const response = await authApi.refreshToken(refreshToken.value);
        token.value = response.tokens.accessToken;
        refreshToken.value = response.tokens.refreshToken;
        return response;
      } catch (err) {
        // При ошибке обновления токена делаем логаут
        logout();
        throw err;
      }
    }

    async function logout() {
      try {
        const userStore = useUserStore();

        if (!isLocalTestToken(refreshToken.value)) {
          await authApi.logout(refreshToken.value);
        }

        token.value = null;
        refreshToken.value = null;
        userType.value = null;
        userStore.clearUser();
        sessionStorage.removeItem("auth");
      } finally {
        router.push({ name: "auth", params: { type: "login" } });
      }
    }

    async function sendPhoneCode(phone) {
      isLoading.value = true;
      error.value = null;

      try {
        console.log(phone);
        
        const response = await authApi.sendPhoneVerificationCode(phone)
        return response;
      } catch (err) {
        error.value = "Неверно указан номер телефона";
        throw err;
      } finally {
        error.value = null;
        isLoading.value = false;
      }
    }

    return {
      // State
      token,
      refreshToken,
      userType,
      isLoading,
      error,
      // Геттеры
      isAuthenticated,
      // Actions
      setUserType,
      login,
      logout,
      register,
      refreshTokens,
      sendPhoneCode
      // ...
    };
  },
  {
    persist: {
      key: "auth",
      storage: sessionStorage, // или localStorage, если нужно долгосрочное
      paths: ["token", "refreshToken", "userType"], // какие поля сохранять
    },
  },
);
