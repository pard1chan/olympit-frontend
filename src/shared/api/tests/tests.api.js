import { apiClient } from "../apiClient";

export const testApi = {
  async getTestsBySubject(subject) {
    const params = {};

    if (subject) params.subject = subject;

    return await apiClient.get("/tests", {
      params: params,
    });
  },

  async getTestByCourse(courseId) {
    return await apiClient.get(`/courses/${courseId}/tests`);
  },

  async getTestById(id) {
    return await apiClient.get(`/tests/${id}`);
  },

  async createTest(data) {
    return await apiClient.post("/tests", data);
  },

  async updateTest(id, data) {
    return await apiClient.put(`/tests/${id}`, data);
  },

  async addQuestionToTest(id, data) {
    return await apiClient.post(`/tests/${id}/questions`, data);
  },

  async deleteTest(id) {
    return await apiClient.delete(`/tests/${id}`);
  },
  async finishTest(id, data) {
    return await apiClient.post(`/tests/${id}/submit`, data);
  },
};
