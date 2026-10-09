<script setup>
import { SUBJECTS_ARRAY } from '@/shared/constants';
import { Dropdown, Input } from '@/shared/ui';
import { inject } from 'vue';

const { title, description, subject, studentsClass } = inject('course')
</script>

<template>
  <form @submit.prevent class="course-form">
    <Input v-model="title" label="Название" placeholder="Физика" />
    <Input v-model="description" label="Описание" type="textarea" placeholder="Курс предназначен..." />
    <Dropdown v-model="subject" placeholder="Предмет" :items="SUBJECTS_ARRAY.dropdownElements" />
    <!-- <Input v-model="studentsClass" label="Для какого класса курс" placeholder="11"  /> -->
  </form>
</template>

<style lang="scss" scoped>
.course-form {
  display: grid;
  row-gap: 20px;
}
</style>