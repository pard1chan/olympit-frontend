<template>
  <div class="list">
    <h3 v-if="title" class="list__title">{{ title }}</h3>
    <ul class="list__items">
      <slot name="items">
        <ListItem v-for="(item, index) in items" :key="getItemKey(item, index)" :item="item" :index="index">
          <template #default="{ item }">
            {{ getItemLabel(item) }}
          </template>
        </ListItem>
      </slot>
    </ul>
  </div>
</template>

<script setup>
import ListItem from './ListItem.vue'

const props = defineProps({
  title: String,
  items: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  },
  itemLabel: {
    type: [String, Function],
    default: 'name'
  }
})

// Функция для получения ключа элемента
const getItemKey = (item, index) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  return item[props.itemKey] || index
}

// Функция для получения текста элемента
const getItemLabel = (item) => {
  if (typeof props.itemLabel === 'function') {
    return props.itemLabel(item)
  }
  return item[props.itemLabel] || String(item)
}
</script>

<style lang="scss" scoped>
.list {
  &__items {
    display: flex;
    flex-direction: column;
    row-gap: 20px;

    max-height: 600px;
    overflow-y: scroll;

    @include tablet {
      scrollbar-width: none;
    }
  }
}
</style>