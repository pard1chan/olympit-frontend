<script setup>
import { onMounted, ref } from 'vue';
import { useEvents } from '../../composables/useEvents';
import EventItem from '../EventItem/EventItem.vue';
import { useAuthStore } from '@/shared/stores';
import { storeToRefs } from 'pinia';


const { fetchEvents, removeEvent, events } = useEvents()

const columns = ref(['Название', 'Тип', 'Начало', 'Окончание', 'Формат', 'Действия'])

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchEvents()
  }
})
</script>

<!-- Родительский компонент -->
<template>
  <div class="events block">
    <table v-if="events" class="events__table">
      <thead class="events__table-head">
        <tr>
          <th v-for="(col, idx) in columns" :key="idx">{{ col }}</th>
        </tr>
      </thead>
      <tbody class="events__table-body">
        <tr v-for="eventItem in events" :key="eventItem.id">
          <EventItem :event-item="eventItem" @delete="removeEvent" />
        </tr>
      </tbody>
    </table>
    <div class="events__empty" v-else>
      Здесь пока пусто!
      <router-link class="link" :to="{ name: 'calendar-events-create' }">Создать первое событие</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.events {
  position: relative;

  &__table {
    width: 100%;
    border-collapse: collapse;

    @include tablet {
      display: block;

      &-head {
        display: none; // Скрываем заголовки на планшетах
      }

      &-body {
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr; // Можно сделать 2 колонки если нужно
      }

      tr {
        display: block;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }
    }


  }

  &__empty {
    display: grid;
    row-gap: 10px;
    place-items: center;
    font-weight: 500;
    font-size: fluid(18, 14);
  }
}
</style>