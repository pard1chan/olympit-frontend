<template>
  <Card padding="55px">
    <div class="auth-card">
      <div class="auth-card__header">
        <logo size="medium"/>
        <h2 class="h2 auth-card__title" v-if="title">{{ title }}</h2>
        <div class="h6" v-if="description">{{ description }}</div>
      </div>
      <div class="auth-card__content">
        <slot />
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from '../Card';
import Logo from '../Logo';

defineProps({
  title: String,
  description: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.auth-card {
  display: grid;
  place-items: center;
  text-align: center;
  row-gap: 11px;
  max-width: 410px;

  &__content {
    min-width: 100%;
  }
}
</style>