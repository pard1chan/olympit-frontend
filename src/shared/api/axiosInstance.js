import axios from "axios";
import { apiConfig } from "./api.config";
import { tokenManager } from "../lib/tokens";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosBasic = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken(); // теперь строка
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh') || 
        originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    const refreshToken = tokenManager.getRefreshToken(); // теперь строка
    if (!refreshToken) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axiosBasic.post('/auth/refresh', {
        refreshToken: refreshToken
      });

      const { AccessToken, RefreshToken: newRefreshToken } = response.data.tokens;
      tokenManager.setTokens(AccessToken, newRefreshToken);

      processQueue(null, AccessToken);
      
      originalRequest.headers.Authorization = `Bearer ${AccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenManager.clearTokens();
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

export const api = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  request: axiosInstance.request,
  head: axiosInstance.head,
};