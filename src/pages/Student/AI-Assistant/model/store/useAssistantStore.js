import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { assistantApi } from "../api/assistant.api";
import { useChatStorage } from "../composables/useChatStorage";

export const useAssistantStore = defineStore("assistant", () => {
  const chatStorage = useChatStorage();

  // State
  const currentMessage = ref(null);
  const currentChatHistory = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentChatId = ref(null);

  onMounted(chatStorage.loadAllChats);

  const savedChats = ref(chatStorage.savedChats);

  // Actions
  async function fetchChatHistory() {
    loading.value = true;
    error.value = null;

    try {
      const response = await assistantApi.fetchChatHistory();
      currentChatHistory.value = response.data || [];
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function sendMessage(message, fileUrl = null) {
    loading.value = true;
    error.value = null;

    try {
      const response = await assistantApi.sendMessageToAssistant(
        message,
        fileUrl,
      );

      const newMessage = {
        ...response,
        message,
        timestamp: new Date().toISOString(),
      };

      // Add to current chat history
      currentChatHistory.value.push(newMessage);

      // If this chat is saved, update the saved version
      if (currentChatId.value) {
        updateSavedChat();
      }

      currentMessage.value = newMessage;
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function uploadFile(file) {
    try {
      const result = await assistantApi.uploadFileInChat(file);
      return result;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }
  function createNewChat() {
    currentChatHistory.value = [];
    const newChat = chatStorage.createNewChat();
    currentChatId.value = newChat.id;
    currentMessage.value = null;
    currentChatHistory.value = newChat.messages
    
    return newChat;
  }

  function saveChat() {
    if (currentChatHistory.value.length === 0) {
      throw new Error("Cannot save empty chat");
    }

    // Generate a unique ID for this chat
    const chatId = currentChatId.value || Date.now().toString();
    const chatTitle =
      currentChatHistory.value[0]?.message?.substring(0, 30) + "..." ||
      "New Chat";

    const savedChat = {
      id: chatId,
      title: chatTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [...currentChatHistory.value],
    };

    try {
      chatStorage.saveChat(savedChat);
      currentChatId.value = chatId;
      return savedChat;
    } catch (error) {
      throw error;
    }
  }

  function updateSavedChat() {
    if (!currentChatId.value || currentChatHistory.value.length === 0) {
      return;
    }

    chatStorage.updateChatMessages(currentChatId.value, [
      ...currentChatHistory.value,
    ]);
  }

  function loadChat(chatId) {
    const chat = chatStorage.getChatById(chatId);
    
    if (chat) {
      currentChatHistory.value = [...chat.messages];
      currentChatId.value = chatId;
    }
  }

  function deleteChat(chatId) {
    chatStorage.deleteChat(chatId);

    // If deleting current chat, clear current chat
    if (currentChatId.value === chatId) {
      clearChat();
    }
  }

  function clearChat() {
    currentChatHistory.value = [];
    const idx = savedChats.value.findIndex((c) => c.id === currentChatId.value);
    
    if (idx !== -1) {
      savedChats.value[idx].messages = [];
    }

    chatStorage.clearChat(currentChatId.value);
    currentChatId.value = null;
    currentMessage.value = null;
  }

  function canSaveMoreChats() {
    return chatStorage.canSaveMoreChats();
  }

  function getRemainingSlots() {
    return chatStorage.getRemainingSlots();
  }

  return {
    fetchChatHistory,
    sendMessage,
    uploadFile,
    saveChat,
    updateSavedChat,
    loadChat,
    deleteChat,
    clearChat,
    createNewChat,
    canSaveMoreChats,
    getRemainingSlots,
    savedChats: chatStorage.savedChats, // Use from storage
    currentChatHistory,
    currentChatId,
    currentMessage,
    loading,
    error,
  };
});
