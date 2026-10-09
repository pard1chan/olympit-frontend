<template>
  <component :is="iconComponent" @click="handleClick" :class="['icon-button']" :style="{ width: size, height: size }" />
</template>

<script setup>
const props = defineProps({
  iconComponent: Object,
  size: {
    type: String,
    default: '30px'
  },
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style lang="scss" scoped>
.icon-button {
  cursor: pointer;
  aspect-ratio: 1;

  @include hover {
    scale: 1.05;
  }

  &.is-disabled {
    @include disabled;
  }
}
</style>