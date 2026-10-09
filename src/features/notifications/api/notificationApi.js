import { apiClient } from "@/shared/api/apiClient";

export const notificationApi = {
  async fetchNotifications(params = {}) {
    return await apiClient.get("/notifications", { params });
  },

  async createNotifications(data) {
    return await apiClient.post("/notifications", data);
  },

  async markAsRead(id) {
    return await apiClient.put(`/notifications/${id}/read`);
  },
};
