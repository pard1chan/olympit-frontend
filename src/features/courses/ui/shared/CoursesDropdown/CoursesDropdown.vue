<!-- CourseFilterDropdown.vue -->
<script setup>
import { Dropdown } from '@/shared/ui';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  },
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<template>
  <Dropdown 
    :modelValue="modelValue"
    @update:modelValue="handleChange"
    :items="items"
    :multiple="false"
    :searchable="false"
    :clearable="true"
    placement="bottom-end"
    size="small"
    width="100%"
  >
  </Dropdown>
</template>