// composables/useAssistant.js
import { storeToRefs } from "pinia";
import { useAssistantStore } from "../store/useAssistantStore";
import { onUnmounted, ref } from "vue";
import { useToasts } from "@/shared/lib/composables/useToasts";
import { assistantApi } from "../api/assistant.api";

export function useAssistant() {
  const assistantStore = useAssistantStore();
  const toasts = useToasts();

  const fileInput = ref(null);
  const message = ref(null);
  const uploadedFile = ref(null);

  const {
    currentChatHistory,
    savedChats,
    currentChatId,
    loading,
    getRemainingSlots,
  } = storeToRefs(assistantStore);

  const sendMessage = async () => {
    let fileToSend = null;

    if (uploadedFile.value) {
      fileToSend = uploadedFile.value;
      uploadedFile.value = null;
    }
    if (!message.value) return;

    await assistantStore.sendMessage(message.value, fileToSend);

    message.value = null;
  };

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    const result = await assistantStore.uploadFile(file);
    uploadedFile.value = result.fileUrl;
    event.target.value = "";
  };

  const removeUploadedFile = () => {
    uploadedFile.value = null;

    if (fileInput.value) {
      fileInput.value = null;
    }
  };

  const saveCurrentChat = () => {
    if (!assistantStore.canSaveMoreChats() && !currentChatId.value) {
      toasts.error("У вас слишком много чатов!");
      throw new Error(
        `You can only save  more chats. Please delete one to save a new chat.`,
      );
    }

    toasts.success("Чат успешно сохранен!");
    return assistantStore.saveChat();
  };

  const createNewChat = async (text) => {
    if (text) {
      message.value = text;
      uploadedFile.value = null;
      assistantStore.createNewChat();
      await assistantStore.sendMessage(message.value);
      message.value = "";
    }

    // uploadedFile.value = null;
    // return assistantStore.createNewChat();
  };

const analyzeTest = async () => {
  loading.value = true
  try {
    const result = await assistantApi.analyzeLastTest();
    
    // Проверяем, что результат содержит рекомендации
    if (result?.recommendations) {
      // Добавляем сообщение ассистента в историю чата
      assistantStore.$patch((state) => {
        state.currentChatHistory.push({
          role: 'assistant',
          message: 'Проанализируй результаты моего последнего теста',
          response: result.recommendations,
        });
      });
    } else {
      toasts.warning('Нет рекомендаций для отображения');
    }
  } catch (error) {
    toasts.error('Ошибка при анализе теста');
    console.error(error);
  } finally {
    loading.value = false
  }
};

  const loadChat = (chatId) => {
    assistantStore.loadChat(chatId);
  };

  const deleteChat = (chatId) => {
    toasts.success("Чат успешно удален!");
    assistantStore.deleteChat(chatId);
  };

  onUnmounted(() => {
    assistantStore.clearChat();
  });

  return {
    fileInput,
    message,
    uploadedFile,
    fetchHistory: assistantStore.fetchChatHistory,
    clearChat: assistantStore.clearChat,
    saveChat: saveCurrentChat,
    loadChat,
    deleteChat,
    sendMessage,
    uploadFile,
    currentChatHistory,
    savedChats,
    currentChatId,
    loading,
    getRemainingSlots,
    createNewChat,
    removeUploadedFile,
    analyzeTest,
  };
}
