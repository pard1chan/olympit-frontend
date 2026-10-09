<script setup>
import CreateForm from '@/shared/ui/CreateForm/CreateForm.vue';
import { useEvents } from '../../composables/useEvents';

const { fields, isValid, createEvent, cancel } = useEvents()
</script>

<template>
  <CreateForm 
    title="Создать событие"
    :fields 
    :is-valid
    @cancel="cancel"
    @submit="createEvent"
    />
</template>