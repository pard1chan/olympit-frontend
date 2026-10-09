<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { EventForm, EventList } from './ui';

const route = useRoute()
const routeName = computed(() => route.name)
</script>

<template>
  <div class="events container">
    <template v-if="routeName === 'calendar-events-create' || routeName === 'calendar-events-edit'">
      <router-link class="link" :to="{ name: 'calendar-events' }">Перейти к списку событий</router-link>
      <EventForm />
    </template>

    <template v-else>
      <router-link class="link" :to="{ name: 'calendar-events-create' }">Перейти к созданию событий</router-link>
      <EventList />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.events {
  display: grid;
  row-gap: 15px;
}
</style>