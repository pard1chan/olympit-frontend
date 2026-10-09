<script setup>
import CreateForm from '@/shared/ui/CreateForm/CreateForm.vue';
import { useEvents } from './composables/useEvents';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const { fields, isValid, event, cancel, getEventById, updateEvent } = useEvents()

const route = useRoute()

onMounted(async () => {
  await getEventById(route.params.id)
})
</script>

<template>
  <div class="container">
    <CreateForm 
      v-if="event"
      title="Редактировать событие" 
      :fields
      :is-valid 
      @cancel="cancel" 
      @submit="updateEvent" 
      />
  </div>
</template>