<template>
  <div class="stat-block block">
    <div class="stat-block__top">
      <span>{{ title }}</span>
      <component class="icon" :is="icon"/>
    </div>
    <h4> {{ num }}</h4>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: Object,
  num: Number
})
</script>

<style scoped lang="scss">
.stat-block {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-weight: 300;
    }
  }
}

.icon {
  color: var(--color-pink);
}
</style>