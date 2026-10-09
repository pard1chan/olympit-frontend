<template>
  <div class="course-materials-uploading block">
    <h2 class="course-materials-uploading__title">Материалы курса</h2>
    <label class="course-materials-uploading__file" for="file">
      Загрузить материалы
      <input ref="inputRef" @change="upload" type="file" name="file" id="file"
        accept=".pdf,.mp3,.mp4,.doc,.docx,.txt,.ppt,.pptx,application/pdf,audio/mpeg,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation">
    </label>

    <div class="accepted">
      Разрешенные к загрузке форматы: PDF, MP3, MP4, DOC, DOCX, TXT, PPT, PPTX
    </div>

    <ul v-if="files?.length > 0" class="course-materials-uploading__list">
      <li class="course-materials-uploading__item" v-for="file in files" :key="file.name">
        <span>{{ file.name }}</span>
        <IconButton v-if="route.name !== 'courses-update'" class="icon" @click="remove(file)"
          :icon-component="IconClose" size="20px" />
      </li>
    </ul>
    <div class="course-materials-uploading__btns">
      <Button v-if="route.name !== 'courses-update'" @click="emits('create')" :disabled="!isValid" label="Создать" />
      <Button v-else label="Обновить" @click="emits('update')" />
      <Button label="Отмена" @click="emits('cancel')" mode="secondary" />
    </div>
  </div>
</template>

<script setup>
import IconButton from '@/shared/ui/IconButton';
import { IconClose } from '@/shared/ui/Icons';
import { Button } from '@/shared/ui';
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const { files, upload, remove, inputRef, isValid } = inject('course')

const emits = defineEmits(['create', 'update', 'cancel'])
const route = useRoute()
</script>

<style lang="scss" scoped>
.course-materials-uploading {
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 15px;

  &__title {
    margin-bottom: 10px;
  }

  &__file {
    font-weight: 500;

    @include hover {
      text-decoration: underline;
    }

    input {
      display: none;
    }
  }

  &__list {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 10px;
    justify-content: start;

    background-color: #f8f9fa;
    color: #212529;
    border-radius: 12px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    cursor: pointer;

    .icon {
      color: red;
      cursor: pointer;
    }

  }

  &__btns {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
  }
}

.accepted {
  padding: 5px;
  border-radius: 12px;
  color: #22223b;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}
</style>