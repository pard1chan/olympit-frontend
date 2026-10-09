<script setup>
import { Button, Container, Input } from '@/shared/ui';
import MessagesList from '@/widgets/MessagesList';
import ChatSidebar from '@/widgets/ChartSidebar';
import MessageInput from '@/widgets/MessageInput';
import { useForum } from './composables/useForum';
import IconButton from '@/shared/ui/IconButton/IconButton.vue';
import HistoryIcon from '@/shared/ui/Icons/HistoryIcon.vue';
import { onMounted, ref } from 'vue';
import { useDevice } from '@/shared/lib/composables/useDevice';
import { useRoute } from 'vue-router';

const { threads, thread, message, threadHistory, isOpen, title, desc, sendMessage, loadThread, removeThread, createThread, close, open } = useForum()
const { userType } = JSON.parse(sessionStorage.getItem('auth'))
const { isDesktop } = useDevice()

const list = ref()
const aside = ref()
const route = useRoute()

const send = async () => {
  await sendMessage()
  list.value?.scrollToBottomSmooth()
}
const load = async (id, limit, offset) => {

  await loadThread(id, 0, offset)
  // list.value?.scrollToBottomSmooth()
}

const create = async () => {

  if (isDesktop.value) await createThread()
  else {
    await createThread()
    aside.value?.close()
  }

}

const openSidebar = () => {
  aside.value?.open()
};

onMounted(async () => {
  if (route.params.id) {
    await loadThread(route.params.id)
  }
})
</script>

<template>
  <Container>
    <div class="forum">
      <ChatSidebar class="forum__sidebar" title="Темы" :items="threads" @load="load" @add="open" :role="userType"
      @remove="removeThread"
        ref="aside" />
      <MessagesList ref="list" :messages="threadHistory" :thread @load="load" class="forum__messages" />
      <MessageInput v-if="thread" class="forum__input" placeholder="Начните писать..." v-model:message="message"
        @send-message="send" />
      <IconButton class="floating-toggle hidden-tablet-above" @click="openSidebar" :icon-component="HistoryIcon"
        aria-label="Open chat history" />
    </div>

    <div v-if="isOpen" class="modal">
      <div class="modal__inner">
        <Input mode="transparent" v-model="title" type="text" placeholder="Название" />
        <Button @click="create" label="создать" />
        <Button @click="close" mode="secondary" label="Отмена" />
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.forum {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr auto;
  position: relative;
  overflow: hidden;
  column-gap: 40px;
  height: 100%;
  min-height: 500px; // минимальная высота

  grid-template-areas:
    "sidebar messages"
    "sidebar input";

  @include tablet {
    grid-template-columns: 1fr; // одна колонка на мобильных
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "messages"
      "input";
  }

  &__sidebar {
    grid-area: sidebar;
  }

  &__messages {
    grid-area: messages;

  }

  &__input {
    grid-area: input;
  }
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 100dvh;
  user-select: none;
  background-color: #e9ecef;

  &__inner {

    position: relative;
    padding: 10px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    width: 80%;
    max-width: 500px;

    border: 1px solid #fff;
    background-color: #fff;
    border-radius: 12px;

    z-index: 1000;

    @include tablet-above {
      padding: 30px;
    }
  }
}
</style>