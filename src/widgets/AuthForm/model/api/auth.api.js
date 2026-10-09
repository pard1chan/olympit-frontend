import { apiClient } from '@/shared/api/apiClient'

export const authApi = {
  async login(credentials) {
    return await apiClient.post('/auth/login', credentials)
  },

  async logout(refreshToken) {
    return await apiClient.post('/auth/logout', { refreshToken: refreshToken })
  },

  async refreshToken(refreshToken) {
    return await apiClient.post('/auth/refresh', { refreshToken: refreshToken })
  },

  async requestPasswordReset(email) {
    return await apiClient.post('/auth/password/reset', { email })
  },

  async resetPassword(token, newPassword) {
    return await apiClient.post('/auth/password/update', {
      token,
      password: newPassword
    })
  },

  async sendPhoneVerificationCode() {
    return await apiClient.post(`/auth/send-code`)
  },

  async verifyEmail(token) {
    return await apiClient.post('/auth/email/verify', { token })
  },

  async register(userData) {
    return await apiClient.post('/auth/register', userData)
  }
}