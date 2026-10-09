<script setup>
import { Container } from '@/shared/ui';
import UserProfileCard from './UserProfileCard/UserProfileCard.vue';
import SubjectSelector from './SubjectSelector/SubjectSelector.vue';
import LeaderBoard from './LeaderBoard/LeaderBoard.vue';
import { useGame } from '../model/composables/useGame';
import { onMounted } from 'vue';

const { createBattle, subject, getTest, loading, error, questions } = useGame()

onMounted(() => {
  if(localStorage.getItem('timer')) localStorage.removeItem('timer')
})
</script>

<template>
  <Container>
    <div class="gamefication">
      <UserProfileCard class="gamefication__user-card" />
      <SubjectSelector 
        @create="createBattle" 
        @find="getTest"
        :questions
        
        v-model:subject="subject" 
        class="gamefication__subject-selector" 
        />
      <LeaderBoard class="gamefication__leaderboard"/>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.gamefication {
  --gridTemplateColumns: 2;

  display: grid;
  grid-template-columns: repeat(var(--gridTemplateColumns), 1fr);
  gap: 20px;
  grid-template-areas: 
  "card card"
  "selector selector"
  "leaderboard leaderboard"
  ;

  &__user-card {
    grid-area: card;
  }

  &__subject-selector {
    grid-area: selector;
  }

  &__leaderboard {
    grid-area: leaderboard;
  }
}
</style>