import { storeToRefs } from "pinia";
import { useForumStore } from "../store/forumStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useProfile } from "@/widgets/UserProfileCard/useUser";
import { useToasts } from "@/shared/lib/composables/useToasts";

export function useForum() {
  const forumStore = useForumStore();
  const { thread, loading, error } = storeToRefs(forumStore);
  const { user } = useProfile();

  const router = useRouter();
  const threads = ref(null);
  const message = ref(null);
  const modal = ref(null);
  const isOpen = ref(null);
  const threadHistory = ref(null);
  const toasts = useToasts();

  const title = ref(null);
  const desc = ref(null);

  onMounted(async () => {
    threads.value = await forumStore.fetchAllThreads();
  });

  const loadThread = async (id, limit, offset) => {
    thread.value = await forumStore.getThreadById(id, limit, offset);
    threadHistory.value = thread.value.messages || [];
    router.push({ name: "thread", params: { id } });
  };

  const sendMessage = async () => {
    if (thread.value && message.value) {
      const response = await forumStore.sendMessage(thread.value.id, {
        message: message.value,
      });

      threadHistory.value.push({
        ...response,
        user: user.value.userId,
      });
      message.value = null;
    }
  };

  const close = () => {
    document.documentElement.classList.remove("is-lock");
    isOpen.value = false;
  };

  const open = () => {
    document.documentElement.classList.add("is-lock");
    isOpen.value = true;
  };

  const createThread = async () => {
    if (!title.value) {
      toasts.error("Укажите название!");
      return;
    }

    const response = await forumStore.createThread({
      title: title.value,
      description: desc.value,
    });
    threads.value.unshift(response);
    close();
    router.push({ name: "thread", params: { id: response.id } });
  };

  const removeThread = async (id) => {
   await forumStore.removeThread(id);
    const idx = threads.value.findIndex(item => item.id === id)
    if (idx !== -1) {
      threads.value.splice(idx, 1)
    }
  };

  return {
    threads,
    thread,
    message,
    threadHistory,
    isOpen,
    title,
    desc,

    sendMessage,
    loadThread,
    createThread,
    removeThread,
    fetchAllThreads: forumStore.fetchAllThreads,
    close,
    open,
  };
}
