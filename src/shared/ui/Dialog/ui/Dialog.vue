<template>
  <dialog
    ref="dialogRef"
    class="dialog"
    :class="{ 'dialog--open': localOpen }"
  >
    <div class="dialog__content">
      <slot />
    </div>
  </dialog>
</template>

<script setup>
import { useDialog } from '@/shared/lib/composables/useDialog';
import { watch, nextTick } from 'vue';

// Пропсы
const props = defineProps({
  lockScroll: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['open', 'close', 'update:modelValue']);

// v-model
const modelValue = defineModel({
  type: Boolean,
  default: false
});

// Используем useDialog
const { 
  dialogRef, 
  isOpen: localOpen, 
  open, 
  close, 
  toggle 
} = useDialog({
  lockScroll: props.lockScroll,
  closeOnEsc: props.closeOnEsc,
  closeOnOutsideClick: props.closeOnOutsideClick,
  onOpen: () => {
    emit('open');
    emit('update:modelValue', true);
  },
  onClose: () => {
    emit('close');
    emit('update:modelValue', false);
  }
});

// Синхронизация v-model с внутренним состоянием
watch(modelValue, async (newValue) => {
  if (newValue !== localOpen.value) {
    if (newValue) {
      open();
    } else {
      close();
    }
  }
});

// Синхронизация внутреннего состояния с v-model
watch(localOpen, (newValue) => {
  if (newValue !== modelValue.value) {
    emit('update:modelValue', newValue);
  }
});

// Открываем при монтировании если modelValue true
if (modelValue.value && !localOpen.value) {
  nextTick(() => {
    open();
  });
}

// Экспортируем методы
defineExpose({
  open,
  close,
  toggle,
  isOpen: localOpen,
  dialogRef
});
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  inset: 0;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  border: 0;
  outline: none;
  max-width: 500px;
  width: 90%;
  background: white;
  z-index: 1000;

  // Скрытое состояние (по умолчанию)
  opacity: 0;
  visibility: hidden;
  transform: scale(0.9);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;

  // Открытое состояние
  &.dialog--open {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    pointer-events: auto;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
  }
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>