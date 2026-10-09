import { computed, onUnmounted, ref } from "vue";
import { useEventStore } from "../store/eventsStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { formatDateForInputUTC } from "@/shared/lib/formatters/FormatDateForInput";

export function useEvents() {
  const eventsStore = useEventStore();
  const { isLoading, error, events, event } = storeToRefs(eventsStore);
  const router = useRouter();

  const title = ref(null);
  const type = ref(null);
  const format = ref(null);
  const dateStart = ref(null);
  const dateEnd = ref(null);

  const fields = ref([
    {
      name: "title",
      label: "Название",
      type: "text",
      placeholder: "Введите текст",
      model: title,
    },
    {
      name: "type",
      label: "Тип",
      type: "dropdown",
      placeholder: "Выберите тип",
      items: [
        {
          label: "Экзамен",
          value: "exam",
        },
        {
          label: "Тест",
          value: "test",
        },
        {
          label: "Контрольная работа",
          value: "checkWork",
        },
        {
          label: "Другое",
          value: "etc",
        },
      ],
      model: type,
    },
    {
      name: "format",
      label: "Формат",
      type: "dropdown",
      placeholder: "Выберите формат",
      items: [
        {
          label: "Онлайн",
          value: "online",
        },
        {
          label: "Оффлайн",
          value: "offline",
        },
        {
          label: "Смешанный",
          value: "etc",
        },
      ],
      model: format,
    },
    {
      name: "dateStart",
      label: "Начало",
      type: "datetime-local",
      placeholder: "",
      model: dateStart,
    },
    {
      name: "dateEnd",
      label: "Конец",
      type: "datetime-local",
      placeholder: "",
      model: dateEnd,
    },
  ]);

  const isValid = computed(() => {
    return (
      title.value &&
      type.value &&
      format.value &&
      dateStart.value &&
      dateEnd.value
    );
  });

  const cancel = () => {
    title.value = null;
    type.value = null;
    format.value = null;
    dateStart.value = null;
    dateEnd.value = null;

    localStorage.removeItem("event");
    router.push({ name: "calendar-events" });
  };

  const createEvent = async () => {
    await eventsStore.createEvent({
      title: title.value,
      type: type.value,
      link: format.value,
      startsAt: dateStart.value + ":00Z",
      endsAt: dateEnd.value + ":00Z",
    });

    title.value = null;
    type.value = null;
    format.value = null;
    dateStart.value = null;
    dateEnd.value = null;

    router.push({ name: "calendar-events" });
  };

  const getEventById = async (id) => {
    const result = await eventsStore.getEventById(id);

    if (result) {
      title.value = result.title;
      type.value = result.type;
      format.value = result.link;
      dateStart.value = formatDateForInputUTC(result.createdAt);
      dateEnd.value = formatDateForInputUTC(result.endsAt);
    }
  };

  const updateEvent = async () => {
    await eventsStore.updateEvent(event.value.id, {
      title: title.value,
      type: type.value,
      link: format.value,
      startsAt: dateStart.value + ":00Z",
      endsAt: dateEnd.value + ":00Z",
    });
    router.push({ name: "calendar-events" });
  };

  onUnmounted(() => {
    localStorage.removeItem('event')
  })

  return {
    fields,
    isValid,
    events,
    isLoading,
    event,

    createEvent,
    cancel,
    fetchEvents: eventsStore.fetchEvents,
    removeEvent: eventsStore.removeEvent,
    getEventById,
    updateEvent,
  };
}
