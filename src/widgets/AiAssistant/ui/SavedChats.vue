<!-- SavedChats.vue -->
<script setup>
import { useAssistant } from '@/pages/Student/AI-Assistant/model/composables/useAssistant';

const { savedChats, loadChat, deleteChat, currentChatId } = useAssistant();

const handleChatClick = (chatId) => {
  loadChat(chatId);
};

const handleDeleteChat = (chatId, event) => {
  event.stopPropagation();
  if (confirm('Are you sure you want to delete this chat?')) {
    deleteChat(chatId);
  }
};
</script>

<template>
  <div class="saved-chats" v-if="savedChats.length > 0">
    <h3>Saved Chats</h3>
    <div class="chat-list">
      <div 
        v-for="chat in savedChats" 
        :key="chat.id"
        class="chat-item"
        :class="{ active: chat.id === currentChatId }"
        @click="handleChatClick(chat.id)"
      >
        <div class="chat-info">
          <h4>{{ chat.title }}</h4>
          <p class="chat-date">
            {{ new Date(chat.updatedAt).toLocaleDateString() }}
            • {{ chat.messages.length }} messages
          </p>
        </div>
        <button 
          class="delete-btn"
          @click="handleDeleteChat(chat.id, $event)"
        >
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.saved-chats {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;

  h3 {
    margin-bottom: 12px;
    color: #333;
  }
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  &:hover {
    background: #eef5ff;
  }

  &.active {
    border-color: #007bff;
    background: #eef5ff;
  }

  .chat-info {
    flex: 1;
    
    h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #333;
    }
    
    .chat-date {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
  }

  .delete-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    
    &:hover {
      color: #ff4444;
      background: rgba(255, 68, 68, 0.1);
    }
  }
}
</style>