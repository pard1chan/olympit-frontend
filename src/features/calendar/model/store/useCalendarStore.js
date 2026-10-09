import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { calendarApi } from "../../api/calendar.api";
import { tokenManager } from "@/shared/lib/tokens";
import { isLocalTestToken } from "@/shared/config/localTestUsers";

export const useCalendarStore = defineStore("calendar", () => {
  const publiCalendarEvents = ref(null);
  const ownerCalendarEvents = ref(null);
  const isLoading = ref(false);
  const error = ref(null);


  const publicEvents = computed(() => publiCalendarEvents.value)
  const ownerEvents = computed(() => ownerCalendarEvents.value)

  async function fetchPublicCalendarEvents() {
    isLoading.value = true;
    error.value = null;

    try {
      if (isLocalTestToken(tokenManager.getAccessToken())) {
        publiCalendarEvents.value = [];
        return [];
      }

      const response = await calendarApi.fetcStudentCalendarEvents();
      publiCalendarEvents.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOwnerCalendarEvents() {
    isLoading.value = true;
    error.value = null;

    try {
      if (isLocalTestToken(tokenManager.getAccessToken())) {
        ownerCalendarEvents.value = [];
        return [];
      }

      const response = await calendarApi.teacherCalendarEvents();
      ownerCalendarEvents.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    publicEvents,
    ownerEvents,
    isLoading,
    error,
    fetchPublicCalendarEvents,
    fetchOwnerCalendarEvents
  };
});
