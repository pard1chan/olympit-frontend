import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useAuthStore } from "@/shared/stores";
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkExactActiveClass: 'is-active',

  linkActiveClass: "is-active",
});

router.beforeEach(async (to, from, next) => {
  // Получаем экземпляр стора (можно вызывать здесь, так как guard выполняется после инициализации приложения)
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore)

  // Определяем, требует ли целевой маршрут авторизации
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Если маршрут требует авторизации, а пользователь не авторизован
  if (requiresAuth && !isAuthenticated.value) {
    // Перенаправляем на страницу входа (сохраняя исходный путь, чтобы после логина вернуться)
    next({
      name: "auth",
      params: { type: "login" },
      query: { redirect: to.fullPath },
    });
  }
  // Если пользователь уже авторизован и пытается зайти на публичную страницу (логин/регистрация)
  else if (!requiresAuth && isAuthenticated.value && to.name === "auth") {
    // Перенаправляем на главную (или любую другую стартовую страницу для авторизованных)
    next({ name: "home" });
  } else {
    // В остальных случаях пропускаем переход
    next();
  }
});

export default router;
