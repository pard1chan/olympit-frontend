export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8070/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  endpoints: {
    notifications: "/notifications",
    auth: "/auth",
  },

  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};
