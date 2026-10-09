import { useLocalStorage } from "@/shared/lib/composables/useLocalStorage";
import { ref, watch } from "vue";

export function useChatStorage() {
  const STORAGE_KEY = "chats";

  const storage = useLocalStorage({ maxItems: 15 });
  const savedChats = ref(storage.getItems(STORAGE_KEY));

  const generateChatId = () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  watch(
    savedChats,
    (newChats) => {
      storage.setItems(STORAGE_KEY, newChats);
    },
    { deep: true },
  );

  const createNewChat = () => {
    const chatId = generateChatId();
    const newChat = {
      id: chatId,
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      isNew: true, // Flag to identify new chats
    };
    return newChat;
  };

  const saveChat = (chatData) => {
    const chats = storage.getItems(STORAGE_KEY);
    const isChatAlreadyExist = chats.find((chat) => chat.id === chatData.id);

    if (!chats.length >= storage.maxItems && !isChatAlreadyExist) {
      throw new Error(
        `Maximum ${storage.maxItems} saved chats allowed. Please delete one to save a new chat.`,
      );
    }

    const updatedChats = storage.addItem(STORAGE_KEY, chatData);
    savedChats.value = updatedChats;

    return chatData;
  };

  const loadAllChats = () => {
    savedChats.value = storage.getItems(STORAGE_KEY);
    return savedChats.value;
  };

  const deleteChat = (chatId) => {
    const updatedChats = storage.deleteItem(STORAGE_KEY, chatId);
    savedChats.value = updatedChats;
    return updatedChats;
  };

  const clearChat = (chatId) => {

    const updatedChats = storage.updateItem(STORAGE_KEY, chatId, {
      messages: [],
      updatedAt: new Date().toISOString(),
    });

    return updatedChats;
  };

  const updateChatMessages = (chatId, messages) => {
    const updatedChats = storage.updateItem(STORAGE_KEY, chatId, {
      messages,
      updatedAt: new Date().toISOString(),
    });
    savedChats.value = updatedChats;
  };

  const getChatById = (chatId) => {
    return savedChats.value.find((chat) => chat.id === chatId);
  };

  const canSaveMoreChats = () => {
    return savedChats.value.length < storage.maxItems;
  };

  const getRemainingSlots = () => {
    return storage.maxItems - savedChats.value.length;
  };

  return {
    savedChats,
    saveChat,
    loadAllChats,
    deleteChat,
    updateChatMessages,
    getChatById,
    canSaveMoreChats,
    getRemainingSlots,
    MAX_CHATS: storage.maxItems,
    clearChat,
    createNewChat,
  };
}
