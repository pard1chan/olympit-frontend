<script setup>
import { useRoute } from 'vue-router';
import { useTestForm } from './composables/useTeacherTests';
import { onMounted, provide } from 'vue';
import TestUpdateForm from './update/TestUpdateForm.vue';

const test = useTestForm()


const route = useRoute()
provide('test', test)
onMounted(async () => {
  await test.getTestById(route.params.id)
})
</script>

<template>
  <div class="update-test">
    <TestUpdateForm />
  </div>
</template>