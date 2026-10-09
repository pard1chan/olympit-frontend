<script setup>
defineProps({
  title: {
    required: false,
    type: String
  },
  padding: {
    type: String,
    default: '20px'
  }
})
</script>

<template>
  <div class="card">
    <div v-if="title" class="card__top">
      <h2 class="card__title">{{ title }}</h2>
      <slot name="actions"/>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: v-bind('padding');
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius-m);
  row-gap: fluid(40, 20);

  &__top {
    margin-bottom: fluid(40, 20);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>