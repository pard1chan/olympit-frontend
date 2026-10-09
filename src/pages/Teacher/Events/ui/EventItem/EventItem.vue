<template>
  <td data-label="Название">{{ eventItem.title }}</td>
  <td data-label="Тип" class="td-type">
    <span>{{ TYPES[eventItem.type] }}</span>
  </td>
  <td data-label="Начало">{{ formatDate(eventItem.startsAt) }}</td>
  <td data-label="Окончание">{{ formatDate(eventItem.endsAt) }}</td>
  <td data-label="Формат">{{ FORMATS[eventItem.link] }}</td>
  <td data-label="Действия" class="td-actions">
    <IconButton class="edit" :icon-component="IconEdit" size="25px" @click="router.push({ name: 'calendar-events-edit', params: { id: eventItem.id } })" />
    <IconButton class="remove" :icon-component="IconClose" size="25px" @click.stop="$emit('delete', eventItem.id)" />
  </td>
</template>

<script setup>
import { IconClose, IconEdit } from '@/shared/ui/Icons';
import { FORMATS, TYPES } from '../../constants';
import IconButton from '@/shared/ui/IconButton';
import {  useRouter } from 'vue-router';

const props = defineProps({
  eventItem: Object
})

const router = useRouter()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-Ru')
}

defineEmits(['edit', 'delete'])
</script>

<style lang="scss" scoped>
// Десктоп стили
td {
  text-align: center;
  padding: 12px 8px;
}

.td {
  &-type {
    span {
      padding: 4px 16px;

      border: 1px solid #FFA3C4;
      border-radius: 62px;
    }
  }

  &-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;

    @include tablet {
      width: 100%;
    }
  }
}

// Планшетные стили

@include tablet {
  tr {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background: white;
  }

  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #666;
      min-width: 100px;
      font-size: 14px;
    }

    &.td-type {
      span {
        margin-left: auto;
      }
    }

    &.td-actions {
      justify-content: flex-end;
      gap: 10px;

      &::before {
        content: "Действия";
        margin-right: auto;
      }
    }
  }

}

.edit {
  color: #4cc9f0;
}

.remove {
  color: red;
}
</style>
