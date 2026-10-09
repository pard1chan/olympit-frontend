export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL ||  'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  
  // Настройки для разных эндпоинтов
  endpoints: {
    notifications: '/notifications',
    auth: '/auth',
    users: '/users',
    profile: '/profile'
  },
  
  // Настройки ретраев
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  }
} 