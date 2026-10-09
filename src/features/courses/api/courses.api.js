import { apiClient } from "@/shared/api/apiClient";

export const coursesApi = {
  async fetchAllcourses(params = {}) {
    return await apiClient.get("/courses", { params });
  },

  async fetchStudentCourses() {
    return await apiClient.get("/my-courses");
  },

  async getCourseById(id) {
    return await apiClient.get(`/courses/${id}`);
  },

  async getCourseStatistics(id) {
    return await apiClient.get(`/courses/${id}/statistics`);
  },

  async createCourse(data) {
    return await apiClient.sendFormData("/courses", data);
  },

  async updateCourse(id, data) {
    return await apiClient.put(`/courses/${id}`, data);
  },

  async deleteCourse(id) {
    return await apiClient.delete(`/courses/${id}`);
  },

  async subscribeOnCourse(id) {
    return await apiClient.post(`/courses/${id}/enroll`);
  },

  async uploadCourseMaterials(id, data) {
    return await apiClient.uploadFile(
      `/courses/${id}/lessons/upload-file`,
      data,
    );
  },

  async uploadCourseMaterialsVideo(id) {
    return await apiClient.uploadFile(`/courses/${id}/lessons/upload-file`);
  },

  async fetchCourseTests(id) {
    return await apiClient.get(`/courses/${id}/tests`);
  },

  async fetchCourseMaterials(id) {
    return await apiClient.get(`/courses/${id}/lessons`);
  },

  async fetchCourseProgress(id) {
    return await apiClient.get(`/courses/${id}/progress`);
  },
};
