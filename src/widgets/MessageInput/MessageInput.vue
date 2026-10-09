<script setup>
import { useAssistant } from '@/pages/Student/AI-Assistant/model/composables/useAssistant';
import { Button, Input } from '@/shared/ui';
import IconButton from '@/shared/ui/IconButton';
import { FileIcon, IconPaperCliip, IconSendMessage } from '@/shared/ui/Icons';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
  placeholder: String,
  showSuggestion: {
    default: false,
    type: Boolean
  }
})

const model = defineModel('message')
const emits = defineEmits(['sendMessage'])

const route = useRoute()

const {
  uploadFile,
  clearChat,
  saveChat,
  deleteChat,
  fileInput,
  currentChatId,
  uploadedFile,
  removeUploadedFile
} = useAssistant();


const icons = computed(() => {
  if (!route.path.includes('forum')) {
    return [
      {
        icon: IconSendMessage,
        name: 'sendMessage'
      },
      {
        icon: IconPaperCliip,
        name: 'addFile'
      }
    ]
  } else {
    return [
      {
        icon: IconSendMessage,
        name: 'sendMessage'
      },
    ]
  }
})


const handleIconClick = ({ icon }) => {
  if (icon.name === 'sendMessage') {
    emits('sendMessage')
  } else {
    fileInput.value.click();
  }
};
</script>

<template>
  <!-- Message input area -->
  <div class="message-input block">
    <Input :placeholder="placeholder" v-model="model" name="message-input" mode="transparent" :icons="icons"
      icon-size="40px" @keydown="emits('sendMessage')" @icon-click="handleIconClick" />

    <input type="file" id="file" @change="uploadFile" ref="fileInput" style="display: none;" />
    <div v-if="uploadedFile" class="removeFile">
      <IconButton :icon-component="FileIcon" @click="removeUploadedFile" />
      <span>x</span>
    </div>
    <div v-if="showSuggestion" class="message-input__actions">
      <Button @click="clearChat" label="Очистить чат" mode="secondary" />
      <Button @click="saveChat" label="Сохранить чат" mode="action" />
      <Button @click="deleteChat(currentChatId)" label="Удалить чат" mode="danger" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-input {
  display: grid;
  align-self: end;
  row-gap: 5px;

  @include tablet {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;

    @include mobile {
      display: none;
    }
  }
}

.removeFile {
  position: relative;
  display: inline-flex;
  justify-self: start;

  span {
    position: absolute;
    right: -2px;
    top: -8px;
    opacity: 0;
    color: red;
    cursor: pointer;
  }

  @include hover {
    span {
      opacity: 1;
    }
  }
}
</style>