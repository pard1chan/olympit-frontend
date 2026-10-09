<template>
  <div class="empty">{{ text }}</div>
</template>

<script setup>
defineProps({
  text: String,
  size: {
    type: String,
    default: 'medium'
  }
})
</script>

<style lang="scss" scoped>
.empty {
  @include fluid-text(14, 12);

  padding: 10px;
  display: grid;
  place-items: center;
  background-color: #fff;


  color: #878787;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: center;
  font-weight: 600;
}
</style>