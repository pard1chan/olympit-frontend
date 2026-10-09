import { apiClient } from "@/shared/api/apiClient";

export const examApi = {
  async getUserExams(params = {}) {
    return await apiClient.get("/exams", { params });
  },

  async getExamById(id) {
    return await apiClient.get(`/exams/${id}`);
  },

  async createExam(data) {
    return await apiClient.post("/exams", data);
  },

  async startExam(id) {
    return await apiClient.post(`/exams/${id}/start`);
  },

  async getExamQuestions(id) {
    return await apiClient.get(`/exams/${id}/questions`);
  },

  async giveAnswer(id, data) {
    return await apiClient.post(`/exams/${id}/answer`, data);
  },

  async endExam(id) {
    return await apiClient.post(`/exams/${id}/finish`);
  },
};
