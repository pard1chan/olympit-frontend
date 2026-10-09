<script setup>
import { CourseCatalog } from '@/features/courses/ui';
</script>

<template>
  <div class="container">
    <CourseCatalog :filters="false" type="all" />
  </div>
</template>