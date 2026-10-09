<template>
  <div class="admin container">
    <!-- Dropdown управляет выбранным графиком -->
    <Dropdown :items="drops" v-model="selectedChart" />

    <!-- Общая статистика (по умолчанию) -->
    <AdminSystemStats
      v-if="systemStats && selectedChart === 'all'"
      title="Общая статистика"
      :labels="['Пользователи', 'Курсы', 'Уроки', 'Тесты']"
      :primaryData="[
        systemStats.totalUsers,
        systemStats.totalCourses,
        systemStats.totalLessons,
        systemStats.totalTests
      ]"
      :secondaryData="[systemStats.activeUsers, 0, 0, 0]"
      legendPrimary="Всего"
      legendSecondary="Активные"
    />

    <!-- Только пользователи -->
    <AdminSystemStats
      v-if="systemStats && selectedChart === 'totalUsers'"
      title="Пользователи"
      :labels="['Всего пользователей']"
      :primaryData="[systemStats.totalUsers]"
      :secondaryData="[systemStats.activeUsers]"
      legendPrimary="Всего"
      legendSecondary="Активные"
    />
  </div>
</template>

<script setup>
import AdminSystemStats from '@/widgets/AdminSystemStats/AdminSystemStats.vue'
import { useAdmin } from './composables/useAdmin'
import { ref } from 'vue'
import { Dropdown } from '@/shared/ui'

const { systemStats } = useAdmin()

// 🔥 выбранный график (по умолчанию общий)
const selectedChart = ref('all')

const drops = [
  {
    label: 'Общая статистика',
    value: 'all'
  },
  {
    label: 'Общее количество пользователей',
    value: 'totalUsers'
  }
]
</script>

<style lang="scss" scoped>
.admin {
  display: grid;
  row-gap: 20px;
}
</style>
