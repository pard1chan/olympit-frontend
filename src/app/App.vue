<script setup>
import Header from '@/widgets/Header';
import { useProfile } from '@/widgets/UserProfileCard/useUser';
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();
const showHeader = computed(() => route.meta.header);
const { userType } = useProfile();
</script>

<template>
  <Header v-if="showHeader" :user-type />
  <main class="main">
    <RouterView v-slot="{ Component }">
      <Transition name="scale" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>


<!-- Глобальные стили для анимации переходов -->
<style>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.scale-enter-from {
  transform: scale(0.95);
  opacity: 0;
}
.scale-leave-to {
  transform: scale(1.05);
  opacity: 0;
}
</style>