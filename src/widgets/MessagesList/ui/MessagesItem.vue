<template>
  <div v-if="!isBot" class="message block">
    <div class="message__author">
      {{ name }}
      <div class="message__role" v-if="name !== 'вы'">{{ ROLES[message.userRole] }}</div>
    </div>
    <p class="message__text">
      {{ message.message }}
    </p>
  </div>
  <template v-else>
    <div class="message block req">
      <div class="message__author">
        Вы
      </div>
      <p class="message__text">
        {{ message.message }}
      </p>
    </div>

    <div class="message block res">
      <div class="message__author">
        Ассистент
      </div>
      <p class="message__text">
        {{ message.response }}
      </p>
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  message: Object,
  id: String,
})

const route = useRoute()

const isBot = computed(() => route.name === 'ai-assistant')

const ROLES = {
  'student': 'ученик',
  'teacher': 'педагог',
}

const name = computed(() => props.id === props.message.userId ? 'вы' : props.message.userNickname)
const isOwner = computed(() => {
  return props.id === props.message.userId ? 'end' : 'start'
})
</script>

<style lang="scss" scoped>
.message {
  min-width: 150px;
  max-width: 480px;
  display: grid;
  row-gap: fluid(13, 10);

  font-size: 14px;
  justify-self: v-bind('isOwner');
  align-self: end;

  &__author {
    color: var(--color-pink);
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 3px;
  }

  &__text {
    font-weight: 300;
    font-size: 14px;
  }

  &__role {
    font-weight: 300;
    font-size: 10px;
    color: var(--color-primary);
  }
}

.req {
  justify-self: end;
}

.res {
  justify-self: start;
}
</style>