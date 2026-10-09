<script setup>
import { useAssistant } from '@/pages/Student/AI-Assistant/model/composables/useAssistant';
import { Button } from '@/shared/ui';

const { createNewChat, analyzeTest } = useAssistant()

</script>

<template>
  <header class="chat-header hidden-on-mobile">
    <Button label="Теория" mode="secondary" @click="createNewChat('Помоги с теорией')" />
    <Button label="Практика" mode="secondary" @click="createNewChat('Помоги с практикой')" />
    <Button label="Прогресс" mode="secondary" @click="createNewChat('Я хочу улучшить свой прогресс')" />
    <Button label="Рекомендации" mode="secondary" @click="analyzeTest" />
  </header>
</template>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  align-items: center;
  row-gap: 10px;
  column-gap: fluid(30, 10);
  flex-wrap: wrap;

  @include tablet {
    position: sticky;
    z-index: 100;
    top: 0;
  }
}
</style>