<template>
  <header class="header">
    <Container>
      <div class="header__inner">
        <router-link :to="{ name: 'home' }">
          <Logo />
        </router-link>
        <MobileMenuDialog ref="mobileMenuRef">
          <template #menu>
            <Navbar class="nv" :links="nav[userType]" :mobile-menu-control="mobileMenuRef" />
          </template>

          <template #actions>
            <Button @click="authStore.logout(token)" mode="icon" :icon="IconLogout" hide-on-mobile />
          </template>
        </MobileMenuDialog>
        <BurgerButton @click="openMobileMenu" />
      </div>
    </Container>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BurgerButton from '@/shared/ui/BurgerButton';
import Button from '@/shared/ui/Button';
import Container from '@/shared/ui/Container';
import Navbar from '../Navbar';
import MobileMenuDialog from '../MobileMenu';
import Logo from '@/shared/ui/Logo';
import { IconLogout } from '@/shared/ui/Icons';
import { useSessionStorage } from '@/shared/lib/composables/useSessionStorage';
import { useAuthStore } from '@/shared/stores';

const authStore = useAuthStore()
import { storeToRefs } from 'pinia';

const { userType } = storeToRefs(authStore)
const { getItem } = useSessionStorage()

const token = getItem('refresh_token')



const nav = {
  student: [
    {
      name: 'home',
      label: 'Главная',
    },
    {
      name: 'student-subscribed-courses',
      label: 'Мои курсы',
    },
    {
      name: 'student-aviable-courses',
      label: 'Курсы',
    },
    {
      name: 'ai-assistant',
      label: 'ИИ ассистент',
    },
    {
      name: 'exam-simulation',
      label: 'Экзамен симуляция',
    },
    {
      name: 'gamification',
      label: 'Геймификация',
    },
    {
      name: 'forum',
      label: 'Форум',
    },
  ],
  teacher: [
    {
      name: 'home',
      label: 'Главная',
    },
    {
      name: 'teacher-courses',
      label: 'Мои курсы',
    },
    {
      name: 'courses-create',
      label: 'Создать курс',
    },
    {
      name: 'forum',
      label: 'Форум',
    },
  ],
  admin: [
    {
      name: 'admin-panel-users',
      label: 'Управление пользователями'
    },
    {
      name: 'admin-panel-courses',
      label: 'Управление курсами'
    },
  ]
}

const mobileMenuRef = ref()

const openMobileMenu = () => {
  mobileMenuRef.value?.open()
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  padding-block: fluid(20, 14);
  position: sticky;
  z-index: 100;
  top: 0;
  margin-bottom: fluid(50, 20);

  background-color: var(--header-bg-color);
  border-bottom: var(--border);

  animation-name: scrolling-header;
  animation-fill-mode: both;
  animation-timeline: scroll();
  animation-range: 0 100px;

  @keyframes scrolling-header {
    to {
      padding-block: 10px;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 16px;
  }
}
</style>