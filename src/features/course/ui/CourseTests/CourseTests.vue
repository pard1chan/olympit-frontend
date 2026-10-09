<template>
  <div class="course-tests">
    <div class="h2">Тесты курса</div>
    <ul class="course-tests__list">
      <li class="course-tests__item" v-for="test in tests" :key="test.id">
        <router-link class="course-tests__link" :to="{ name: 'test-pass', params: { id: test.id } }">{{ test.title
          }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>

defineProps({
  tests: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.course-tests {
  display: flex;
  flex-direction: column;
  gap: 15px 0;

  &__list {
    display: flex;
    row-gap: 10px;
    flex-direction: column;
  }

  &__link {
    @include hover {
      text-decoration: underline;
    }
  }
}
</style>