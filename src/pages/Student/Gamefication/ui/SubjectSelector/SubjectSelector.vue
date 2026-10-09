<script setup>
import { SUBJECTS_ARRAY } from '@/shared/constants';
import { Button, Card, Dropdown } from '@/shared/ui';

defineProps({
  questions: Array
})

const model = defineModel('subject')

const emits = defineEmits(['find'])
</script>

<template>
  <Card>
    <div class="subject-selector">
      <Dropdown placeholder="Выберите предмет" @change="emits('find')" v-model="model"
        :items="SUBJECTS_ARRAY.dropdownElements" />
      <div></div>
      <Button @click="$emit('create', model)"  label="В бой" />
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.subject-selector {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;

  @include tablet {
    row-gap: 20px;
    grid-template-columns: 1fr;
  }
}
</style>