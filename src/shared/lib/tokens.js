// Token storage manager
export const tokenManager = {
  // Получаем объект auth из sessionStorage (куда persist сохраняет стор)
  getAuthData() {
    const data = sessionStorage.getItem("auth");
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  },

  getAccessToken() {
    const auth = this.getAuthData();
    return auth?.token || null;
  },

  getRefreshToken() {
    const auth = this.getAuthData();
    return auth?.refreshToken || null;
  },

  setTokens(accessToken, refreshToken, rememberMe = false) {
    // Сохраняем в том же формате, что и persist стора
    const auth = this.getAuthData() || {};
    auth.token = accessToken;
    auth.refreshToken = refreshToken;
    // Если rememberMe, можно сохранять в localStorage, но для простоты оставим sessionStorage
    sessionStorage.setItem("auth", JSON.stringify(auth));
    // При необходимости можно также сохранять в localStorage
  },

  clearTokens() {
    sessionStorage.removeItem("auth");
    localStorage.removeItem("auth");
  },

  hasValidToken() {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return true;
    }
  },
};