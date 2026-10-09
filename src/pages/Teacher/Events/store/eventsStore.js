import { calendarApi } from "@/features/calendar/api/calendar.api";
import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { defineStore } from "pinia";
import {  ref } from "vue";

export const useEventStore = defineStore("events", () => {
  const localStorageCustom = useLocalStorage()

  const toast = useToasts();
  const isLoading = ref(false);
  const error = ref(null);
  const events = ref(null);
  const event = localStorageCustom.useStorage('event')

  async function createEvent(data) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await calendarApi.createCalendarEvent(data);
      toast.success("Событие успешно создано!");
      return response;
    } catch (errors) {
      error.value = errors;
      toast.error("Ошибка! Попробуйте опять!");
    } finally {
      isLoading.value = false;
    }
  }

  async function removeEvent(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await calendarApi.removeCalendarEvent(id);
      const idx = events.value.findIndex((i) => i.id === id);
      events.value.splice(idx, 1);
      toast.success("Событие успешно удалено!");
      return response;
    } catch (errors) {
      error.value = errors;
      toast.error("Ошибка! Попробуйте опять!");
    } finally {
      isLoading.value = false;
    }
  }

  async function updateEvent(id, data) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await calendarApi.updateCalendarEvent(id, data);
      // const idx = events.value.findIndex((i) => i.id === id);
      // events.value.splice(idx, 1);
      localStorage.removeItem('event')
      toast.success("Событие успешно обнвлено!");
      return response;
    } catch (errors) {
      error.value = errors;
      toast.error("Ошибка! Попробуйте опять!");
    } finally {
      isLoading.value = false;
    }
  }

  async function getEventById(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await calendarApi.getCalendarEventById(id);
      localStorageCustom.setItems('event', response)
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchEvents() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await calendarApi.teacherCalendarEvents();
      events.value = response;
      return response;
    } catch (errors) {
      error.value = errors;
    } finally {
      isLoading.value = false;
    }
  }


  return {
    events,
    isLoading,
    error,
    event,

    createEvent,
    fetchEvents,
    removeEvent,
    updateEvent,
    getEventById,
  };
});
