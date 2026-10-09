<script setup>
import { useNotifications } from '@/features/notifications/model/useNotifications';
import { Button, Card, Container, Dropdown, Input } from '@/shared/ui';
import { onMounted } from 'vue';

const { title, recieverId, message, students, isValid, date, send, cancel, fetchSstudent } = useNotifications()

onMounted(fetchSstudent)
</script>

<template>
  <Container>
    <Card title="Создать уведомление">
      <form @submit.prevent class="notifications-form">
        <div class="notifications-form__group">
          <label class="notifications-form__label">Заголовок</label>
          <Input mode="transparent" name="title" v-model="title"  placeholder="Введите заголовок" />
        </div>
        <div class="notifications-form__group" v-if="students">
          <label class="notifications-form__label">Получатели</label>
          <Dropdown mode="transparent" v-model="recieverId" placeholder="Выберите получателя" :items="students" />
        </div>
        <div class="notifications-form__group">
          <label class="notifications-form__label">Текст</label>
          <Input mode="transparent" placeholder="Напишите, что хотите отправить" name="message" v-model="message" type="textarea" />
        </div>
        <div class="notifications-form__group">
          <label class="notifications-form__label">Дата</label>
          <Input mode="transparent" type="date" name="date" v-model="date" placeholder="Введите заголовок" />
        </div>
        <div class="notifications-form__btns">
          <Button @click="send" :disabled="!isValid" label="Отправить" />
          <Button @click="cancel" label="Отмена" mode="secondary" />
        </div>
      </form>
    </Card>
  </Container>
</template>

<style lang="scss" scoped>
.notifications-form {
  display: grid;
  row-gap: 20px;

  &__group {
    display: grid;
    row-gap: 7px;

    font-weight: 300;
  }

  &__btns {
    display: flex;
    gap: 15px;

    @include tablet {
      flex-direction: column;
    }
  }
}
</style>