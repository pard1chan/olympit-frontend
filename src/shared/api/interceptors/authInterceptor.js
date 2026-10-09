export const authInterceptor = {
  request: {
    onFulfilled: (config) => {
      // Получаем токен из разных источников
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token") ||
        getCookie("access_token");
        
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Добавляем кастомный заголовок для отслеживания

      return config;
    },
    onRejected: (error) => Promise.reject(error),
  },
};

// Вспомогательная функция
function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([.$?*|{}()\[\]\\\/+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
