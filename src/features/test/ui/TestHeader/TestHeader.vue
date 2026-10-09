<script setup>
import Countdown from '@/features/timer/ui/Countdown.vue';
import { Button } from '@/shared/ui';
import { ref, watch } from 'vue';

const props = defineProps({
  testLength: Number,
  questionIndex: Number,
  isBattle: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0
  },
})

const emit = defineEmits(['finish', 'complete'])

const timer = ref(null)

const finish = () => {
  timer.value?.stop()
  emit('finish')
}


watch(() => props.questionIndex, () => {
  if (timer.value && props.isBattle) {
    timer.value.reset()
    timer.value.start()
  }
})

// Handle timer completion
const handleTimerComplete = () => {
  emit('complete')
}
</script>

<template>
  <header class="test-header block">
    <div class="test-header__questions-count">Вопрос {{ questionIndex + 1 }}/{{ testLength }}</div>
    <Countdown v-if="duration" ref="timer" @complete="handleTimerComplete" :duration="duration" :auto-start="true"
      :key="questionIndex" />
    <Button @click="finish" label="Завершить" />
  </header>
</template>

<style lang="scss" scoped>
.test-header {
  display: flex;
  align-items: center;
  column-gap: 37px;
  font-weight: 600;


  &__questions-count {
    flex: 1;
  }
}
</style>