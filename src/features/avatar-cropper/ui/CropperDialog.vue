<script setup>
import Dialog from '@/shared/ui/Dialog/ui/Dialog.vue';
import { Button } from '@/shared/ui';
import { UploadIcon } from '@/shared/ui/Icons';
import { useUserDialog } from '@/widgets/UserProfileCard/composables/useUserDialog';

const preview = ref(null)
const previewSrc = ref(null)
const inputRef = ref(null)

const { uploadNewAvatar, saveNewAvatar, dialogRef, closeModal } = useUserDialog(preview, previewSrc, inputRef)
</script>

<template>
  <Dialog ref="dialogRef">
    <div class="cropper-dialog">
      <template v-if="previewSrc">
        <div class="preview">
          <img class="preview__img" :src="previewSrc" ref="preview" alt="">
        </div>
      </template>
      <template v-else>
        <h1 class="cropper-dialog__title">Загрузите новую фотографию</h1>
        <label for="avatar-upload" class="cropper-dialog__label">
          <UploadIcon />
          <div class="h3">Кликните или перетащите файл в эту область, чтобы загрузить</div>
          <p class="h6">Максимальный размер файла — 2 МБ.</p>
          <input ref="inputRef" @change="uploadNewAvatar" id="avatar-upload" type="file" accept="image/*"
            class="cropper-dialog__input" />
        </label>
      </template>
      <div class="cropper-dialog__btns">
        <Button @click="saveNewAvatar" label="Сохранить" />
        <Button @click="closeModal" label="Отмена" mode="secondary" full />
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.cropper-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: fluid(24, 15);

  &__subtitle {
    align-self: flex-start;
  }

  &__label {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;

    padding: 10px 14px;

    border: var(--border-dashed);
    border-radius: var(--border-radius-xxs);

    input {
      display: none;
    }

    @include hover {
      background-color: rgba(0, 0, 0, 0.05);
      cursor: pointer;
    }
  }

  &__btns {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px 0;
  }
}
</style>