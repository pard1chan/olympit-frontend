import { apiClient } from "@/shared/api/apiClient";

export const forumApi = {
  async fetchAllThreads(limit) {
    const params = {};

    if (limit) params.limit = limit;

    return await apiClient.get("/forum/threads");
  },

  async getThreadById(id, data) {
    const params = {};

    if (data.limit) params.limit = data.limit;
    if (data.offset) params.offset = data.offset;

    return await apiClient.get(`/forum/threads/${id}`, {
      params,
    });
  },

  async createThread(data) {
    return await apiClient.post("/forum/threads", data);
  },

  async removeThread(id) {
    return await apiClient.delete(`/forum/threads/${id}`);
  },

  async sendMessage(id, data) {
    return await apiClient.post(`/forum/threads/${id}/messages`, data);
  },
};
