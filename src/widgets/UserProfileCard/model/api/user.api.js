import { apiClient } from "@/shared/api/apiClient";

export const userApi = {
  async fetchProfile(params = {}) {
    return await apiClient.get("/profile", { params });
  },

  async fetchUserInfo() {
    return await apiClient.get("/me");
  },

  async updateProfile(data) {
    return await apiClient.put("/profile", data);
  },

  async updateAvatar(file, onProgress = null) {
    return await apiClient.uploadFile(
      "/profile/avatar",
      file,
      "avatar",
      null,
      onProgress,
    );
  },

  async updateEmail(emailData) {
    return await apiClient.put("/profile/email", emailData);
  },

  async updatePassword(passwordData) {
    return await apiClient.put("/profile/password", passwordData);
  },
};
