<template>
  <Transition name="slide">
    <aside v-if="isOpen" class="chat-sidebar block" ref="sidebar">
      <div class="chat-sidebar__header">
        <h2 class="h2">{{ title }}</h2>
        <div class="btns">
          <IconButton @click="emit('add')" v-if="role !== 'student'" class="add" :icon-component="PlusIcon" />
          <button class="close-button" @click="close">
            <IconClose />
          </button>
        </div>
      </div>

      <ul v-if="items?.length" class="chat-sidebar__list">
        <li class="chat-sidebar__item" v-for="item in items" :key="item.id">
          <button @click.self="handleItemClick(item.id)" class="chat-sidebar__link">
            {{ item.title }}
            <IconButton v-if="userId === item.authorId" :icon-component="AdminRemove" @click="emit('remove', item.id)" size="25px" class="error" />
          </button>
        </li>
      </ul>
      <div v-else class="empty-state">
        Здесь пока ничего нет!
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { useAssistant } from '@/pages/Student/AI-Assistant/model/composables/useAssistant';
import { AdminRemove, IconClose, PlusIcon } from '@/shared/ui/Icons';
import { useSidebar } from '../composables/useSidebar';
import { useDevice } from '@/shared/lib/composables/useDevice';
import IconButton from '@/shared/ui/IconButton';
import { useUserStore } from '@/shared/stores';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['close', 'load', 'add', 'remove']);
const { isTablet, isMobile } = useDevice()

defineProps({
  title: String,
  items: {
    type: Array,
    default: () => []
  },
  role: {
    type: String,
    default: 'student'
  }
});

const userStore = useUserStore()
const { userId } = storeToRefs(userStore)


const { loadChat } = useAssistant();
const { sidebar, isOpen, open, close } = useSidebar();

const handleItemClick = (chatId) => {
  // loadChat(chatId);
  emit('load', chatId);
  if (isTablet.value || isMobile.value) {
    close()
  }
};

defineExpose({
  open,
  close
});
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  align-items: center;
  column-gap: 30px;
}

.chat-sidebar {
  text-align: left;
  min-height: 100%;
  max-height: 720px;
  padding: 20px;

  @include tablet {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 100dvh;
    width: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eaeaea;

    .close-button {
      display: none;

      @include tablet {
        display: block;
        width: 36px;
        height: 36px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        cursor: pointer;
      }
    }
  }

  &__list {
    display: grid;
    row-gap: 12px;
    // max-height: calc(100dvh - 120px);
    max-height: calc(100% - 150px);
    overflow-y: auto;
    padding-right: 8px;
  }

  &__link {
    position: relative;
    width: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e9ecef;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .empty-state {
    display: grid;
    place-content: center;
    color: #6c757d;
    font-size: 14px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px dashed #dee2e6;
  }
}

// Анимации для Transition
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>