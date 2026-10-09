<script setup lang="ts">
import { Card } from '@/shared/ui';
import { AchiveIcon } from '@/shared/ui/Icons';

// Создаем массив для демонстрации
const achivements = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Достижение ${i + 1}`
}));
</script>

<template>
  <Card title="Достижения">
    <div class="achivements">
      <div class="achivements__container">
        <div 
          class="achivements__item" 
          v-for="achivement in achivements.slice(0, 5)" 
          :key="achivement.id"
          :title="achivement.title"
        >
          <AchiveIcon />
        </div>
      </div>
    </div>
    
    <template #actions>
      <router-link to="/">Показать все</router-link>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.achivements {
  &__container {
    display: grid;
    grid-template-columns: repeat(5, 1fr); // Фиксируем 5 колонок
    gap: fluid(20, 12);
    justify-content: center;
  }

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1; // Делаем квадратные элементы
    max-width: 69px; // Ограничиваем максимальный размер
    margin: 0 auto;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>