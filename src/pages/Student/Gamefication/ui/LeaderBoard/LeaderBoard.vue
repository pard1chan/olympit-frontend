<script setup>
import { Card, List } from '@/shared/ui';
import { onMounted, ref } from 'vue';
import { gameApi } from '../../model/api/game.api';
import { useGame } from '../../model/composables/useGame';

const { students } = useGame()



onMounted(async () => {
  students.value = await gameApi.usersRating()
})



</script>

<template>
  <Card title="Все ученики">
      <List v-if="students" :items="students" />
  </Card>
</template>