import { apiClient } from "@/shared/api/apiClient";

export const adminApi = {
  async fetchStats() {
    return await apiClient.get("/admin/stats");
  },

  async fetchUsers() {
    return await apiClient.get("/admin/users");
  },
  async fetchCourses() {
    return await apiClient.get("/admin/courses");
  },

  async blockUser(id) {
    return await apiClient.put(`/admin/users/${id}/block`);
  },
  async unBlockUser(id) {
    return await apiClient.put(`/admin/users/${id}/unblock`);
  },
  async removeUser(id) {
    return await apiClient.delete(`/admin/users/${id}`);
  },
  async removeCourse(id) {
    return await apiClient.delete(`/admin/courses/${id}`);
  },
};
