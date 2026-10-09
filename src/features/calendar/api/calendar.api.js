import { apiClient } from "@/shared/api/apiClient";

export const calendarApi = {
  async fetcStudentCalendarEvents(params = {}) {
    return await apiClient.get("/calendar/events/all", { params });
  },

  async teacherCalendarEvents() {
    return await apiClient.get("/calendar/events");
  },

  async createCalendarEvent(data) {
    return await apiClient.post("/calendar/events", data);
  },

  async removeCalendarEvent(id) {
    return await apiClient.delete(`/calendar/events/${id}`);
  },

  async updateCalendarEvent(id, data) {
    return await apiClient.put(`/calendar/events/${id}`, data);
  },

  async getCalendarEventById(id) {
    return await apiClient.get(`/calendar/events/${id}`);
  },
};
