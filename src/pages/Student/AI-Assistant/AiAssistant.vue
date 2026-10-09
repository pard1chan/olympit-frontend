<script setup>
import { Container } from '@/shared/ui';
import ChatSidebar from '@/widgets/ChartSidebar';
import { useAssistant } from './model/composables/useAssistant';
import ChatHeader from '@/features/chatHeader';
import MessagesList from '@/widgets/MessagesList';
import MessageInput from '@/widgets/MessageInput';
import { ref } from 'vue';
import IconButton from '@/shared/ui/IconButton';
import { HistoryIcon, IconSave, PlusIcon } from '@/shared/ui/Icons';

const { savedChats, message, currentChatHistory, loading, sendMessage, loadChat, createNewChat, saveChat } = useAssistant();
const sidebar = ref();
const list = ref()

const send = async () => {
  await sendMessage()
  list.value?.scrollToBottomSmooth()
}
const open = () => sidebar.value?.open()
</script>

<template>
  <Container>
    <div class="assistant">
      <ChatSidebar class="assistant__sidebar" title="Чаты" ref="sidebar" @load="loadChat" :items="savedChats" />

      <!-- Header with toggle button -->
      <ChatHeader class="assistant__header" />

      <MessagesList ref="list" :is-loading="loading" class="assistant__messages" :messages="currentChatHistory" />
      <MessageInput class="assistant__input" show-suggestion placeholder="Помоги с..." v-model:message="message"
        @send-message="send" />

      <div class="assistant__btns floating-toggle hidden-tablet-above">
        <IconButton  @click="open" size="30px" :icon-component="HistoryIcon" />
        <IconButton  @click="createNewChat('Нужна помощь')" :icon-component="PlusIcon" />
        <IconButton  @click="saveChat" :icon-component="IconSave" />
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.assistant {
  position: relative; /* добавили */
  display: grid;
  grid-template-columns: 250px 1fr;
  column-gap: 40px;
  grid-template-areas:
    "sidebar header"
    "sidebar messages"
    "sidebar input";

  @include tablet {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "messages"
      "input";
  }

  &__sidebar { grid-area: sidebar; }
  &__header { grid-area: header; }
  &__messages { grid-area: messages; }
  &__input { grid-area: input; }

  &__btns {
    display: none; /* по умолчанию скрыты */

    @include tablet {
      backdrop-filter: blur(2px);
      opacity: 0.8;
      display: flex;
      align-items: center;
      width: auto;
      border-radius: 40px;
      padding: 8px 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      column-gap: 15px;
    }
  }

  /* Добавляем отступ для списка сообщений на мобильных */
  @include tablet {
    &__messages {
      padding-bottom: 80px; /* чтобы последние сообщения не уходили под кнопки */
    }
  }
}
</style>