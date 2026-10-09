<template>
  <li class="item">
    <div v-if="index !== undefined" class="item__number-circle">
      {{ index + 1 }}
    </div>
    <div class="item__content">
      <div class="item__top">
        <div class="item__name">{{ item.nickname }}</div>
        <div class="item__additional h2">{{ item.totalScore }}</div>
      </div>
    </div>
  </li>
</template>

<script setup>
defineProps({
  item: Object,
  index: Number
})
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding-bottom: 20px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background-image: var(--gradient);
  }

  &:last-child::after {
    display: none;
  }

  &__number-circle {
    width: 77px;
    height: 77px;
    border-radius: 50%;
    background-color: var(--color-pink, #007bff);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    flex-shrink: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    flex-grow: 1;
  }

  &__top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__name {
    @include fluid-text(20, 16);
  }
}
</style>