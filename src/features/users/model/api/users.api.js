import { apiClient } from "@/shared/api/apiClient";

export const usersApi = {
  async fetchStudents() {
    return await apiClient.get("/students");
  },

  async fetchStudentStats() {
    return await apiClient.get(`/students/statistics`);
  },

  async fetchTeachers() {
    return await apiClient.get("/teachers");
  },

  async getTeacherById(id) {
    return await apiClient.get(`/teachers/${id}`);
  },
};
