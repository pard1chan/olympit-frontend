<template>
  <div class="user-profile">
    <template v-if="!isEditing">
      <div class="user-profile__top">
        <img :src="img" alt="" class="user-profile__avatar">
        <div class="user-profile__data">
          <div class="user-profile__name h2">{{ modelName }}</div>
          <div class="user-profile__class" v-if="userType === 'student'">{{ modelClass }} класс</div>
          <div class="user-profile__class" v-else-if="userType === 'teacher'">Педагог</div>
        </div>
      </div>
      <div class="user-profile__email">
        Email
        <div class="h3">{{ modelEmail }}</div>
      </div>
    </template>
    <template v-else>
      <div class="user-profile__top user-profile__top--edit">
        <img @click="emits('avatar-click')" :src="img" alt="" class="user-profile__avatar user-profile__avatar--edit">
        <div class="user-profile__data user-profile__data--edit">
          <Input  v-model="modelName" mode="transparent-outline" size="xs" />
          <Input v-if="userType === 'student'" v-model="modelClass" placeholder="Класс" mode="transparent-outline" size="xs" />
        </div>
      </div>
      <div class="user-profile__email user-profile__email--edit">
        <Input v-model="modelEmail" mode="transparent-outline" size="xs" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { Input } from '@/shared/ui';

const props = defineProps({
  isEditing: {
    default: false,
    type: Boolean
  },
  userType: {
    default: 'student',
    type: String
  },
  img: String
})

const modelName = defineModel('name')
const modelClass = defineModel('class')
const modelEmail = defineModel('email')

const emits = defineEmits(['changeNameAndClass', 'changeEmail', 'avatar-click'])
</script>

<style lang="scss" scoped>
.user-profile {
  display: grid;
  row-gap: fluid(40, 20);
  overflow-x: hidden;
  max-width: 100%;

  &__top {
    display: flex;
    align-items: center;
    column-gap: 20px;
  }

  &__name {
    word-break: break-word;
    /* или overflow-wrap: break-word; */
    max-width: 100%;
    /* гарантирует, что блок не выйдет за родителя */
  }


  &__avatar {
    width: 77px;
    aspect-ratio: 1;
    border-radius: 50%;

    &--edit {
      width: 100px;

    }
  }

  &__data {
    &--edit {
      display: grid;
      row-gap: 9px;


      :deep(input) {
        word-break: break-word;
      }
    }
  }

  &__class {
    font-weight: 300;
  }
}
</style>