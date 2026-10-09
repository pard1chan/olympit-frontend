<!-- MessagesList.vue -->
<script setup>
import { useRoute } from 'vue-router';
import { useMessagesListLogic } from '../composables/useMessagesList';
import MessagesItem from './MessagesItem.vue';
import { computed } from 'vue';


const props = defineProps({
  messages: Array,
  pageSize: {
    type: Number,
    default: 20
  },
  autoScrollEnabled: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    required: false
  }
});

const emits = defineEmits(['load']);

const {
  containerRef,

  user,
  messages,
  loadMessages,
  scrollToBottom,
  scrollToBottomSmooth,
  expose
} = useMessagesListLogic(props, emits);

// Expose scroll methods to parent
defineExpose(expose);

const route = useRoute()

const msg = computed(() => {
  if (route.path.includes('forum') && route.params.id) return 'Здесь пока пусто!'
  else if (route.path.includes('forum') && !route.params.id) return 'Выберите чат или тему!'
  else return 'Начните диалог'
})
</script>

<template>
  <div class="messages-container">
    <ul class="messages-list" ref="containerRef">
      <MessagesItem 
        v-if="messages.length" 
        v-for="message in messages" 
        :key="message.id" 
        :message="message"
        :id="user.userId" 
      />
      <div v-else class="empty-state">{{ msg }}</div>
    </ul>
    
    <div v-if="isLoading" class="loader-container">
      <div class="loader"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.messages-container {
  position: relative;
  min-height: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-list {
  flex: 1;
  display: grid;
  row-gap: 20px;
  padding: 20px 0 30px 0;
  overflow-y: auto;
  min-height: 0;
  height: 100%;
  max-height: 600px;

  @include tablet-above {
    padding-right: 20px;
  }

  @include tablet {
    width: 100%;
    padding-bottom: 80px;
    max-height: 100%;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 60px;
  
  .loader {
    width: 60px;
    aspect-ratio: 4;
    --_g: no-repeat radial-gradient(circle closest-side, #FFA3C4 90%, #0000);
    background:
      var(--_g) 0% 50%,
      var(--_g) 50% 50%,
      var(--_g) 100% 50%;
    background-size: calc(100%/3) 100%;
    animation: l7 1s infinite linear;
  }

  @keyframes l7 {
    33% { background-size: calc(100%/3) 0%, calc(100%/3) 100%, calc(100%/3) 100%; }
    50% { background-size: calc(100%/3) 100%, calc(100%/3) 0%, calc(100%/3) 100%; }
    66% { background-size: calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 0%; }
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
  color: #999;
  font-size: 16px;
  text-align: center;
  padding: 40px;
}
</style>