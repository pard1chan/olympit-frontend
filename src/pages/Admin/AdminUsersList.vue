<template>
  <div class="users container">
    <ul v-if="users" class="users__list">
      <li class="users__item block" v-for="user in users" :key="user.id">
        <div class="users__item-info">
          <div class="users__item-name">{{ user.nickname }}</div>
          <div class="users__item-email">{{ user.email }}</div>
        </div>
        <div class="users__item-role">{{ ROLES[user.role] }}</div>
        <div class="users__item-registerDate">{{ new Date(user.createdAt).toLocaleDateString() }}</div>
        <div class="users__item-buttons">
          <IconButton v-if="!user.blocked" @click="blockUser(user.id)"  class="icon" :icon-component="AdminBan" />
          <IconButton v-else @click="unBlockUser(user.id)"  class="icon" :icon-component="AdminUnBun" />
          <IconButton @click="removeUser(user.id)" class="icon" :icon-component="AdminRemove" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdmin } from './composables/useAdmin';
import IconButton from '@/shared/ui/IconButton';
import { AdminBan, AdminRemove, AdminUnBun } from '@/shared/ui/Icons';

const { getUsers, removeUser, blockUser, unBlockUser, users } = useAdmin()

const ROLES = {
  'student': 'ученик',
  'teacher': 'учитель',
  'admin': 'администратор',
}

onMounted(getUsers)
</script>

<style lang="scss" scoped>
.users {
  &__list {
    display: grid;
    row-gap: 20px;
    max-height: 80dvh;
    font-size: 16px;
  }

  &__item {
    --gridTemplateCplumns: 4;
    display: grid;
    align-items: center;
    grid-template-columns: repeat(var(--gridTemplateCplumns), 1fr);

    grid-template-areas: 
    "info role date btns"
    ;

    @include mobile {
      --gridTemplateCplumns: 2;

      grid-template-areas: 
      "info info"
      "role role"
      "date date"
      "btns btns"
      ;
    }

    &-info {
      grid-area: info;
    }

    &-name {
      font-weight: 500;
      font-size: fluid(20, 16);
    }

    &-email {
      font-weight: 300;
    }

    &-role {
      grid-area: role;
    }

    &-registerDate {
      grid-area: date;
    }

    &-buttons {
      justify-self: end;
      grid-area: btns;

      display: flex;
      align-items: center;
      column-gap: 10px;
    }
  }
}

.icon {
  color: var(--color-pink);
}
</style>