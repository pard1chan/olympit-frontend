<template>
  <dialog ref="dialogRef" class="mobile-menu" :open="isOpen">
    <slot name="menu" />
    <div class="actions">
      <Button @click="close" mode="icon" :icon="IconClose" v-if="isOpen" />
      <slot name="actions" />
    </div>
  </dialog>
</template>

<script setup>
import { useDialog } from '@/shared/lib/composables/useDialog';
import Button from '@/shared/ui/Button';
import { IconClose } from '@/shared/ui/Icons';

const { dialogRef, isOpen, open, close } = useDialog({
  lockScroll: true,
  closeOnEsc: true,
  closeOnOutsideClick: true,
  onOpen: () => console.log('Mobile menu opened'),
  onClose: () => console.log('Mobile menu closed')
})

defineExpose({
  open,
  close,
  isOpen
})
</script>

<style lang="scss" scoped>
.mobile-menu {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100dvh;
  margin: 0;

  flex-direction: column-reverse;
  justify-content: start;
  row-gap: 16px;

  background-color: var(--bg-color);
  border: none;
  transition-duration: var(--transition-duration);
  transition-behavior: allow-discrete;

  @include tablet-above {
    display: contents;
  }

  @mixin starting-styles {
    opacity: 0;
    translate: 50%;
  }

  &[open] {
    display: flex;

    @starting-style {
      @include starting-styles;
    }
  }

  &:not([open]) {
    @include starting-styles;
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>