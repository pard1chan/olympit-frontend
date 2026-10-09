<template>
  <Transition name="slide-fade">
    <p v-if="error" class="field-error">
      {{ error }}
    </p>
  </Transition>
</template>

<script setup>
const props = defineProps({
  error: String,
  position: {
    type: String,
    default: 'left'
  }
})
</script>

<style scoped>
.field-error {
  font-size: 12px;
  text-align: v-bind('props.position');
  color: #e53935;
  margin-top: 4px;
}
</style>

