<template>
<Card :title="title">
  <form @submit.prevent class="create-form">
    <div class="create-form__group" v-for="field in fields" :key="field.name">
      <label class="create-form__label">{{ field.label }}</label>
      <Input 
        v-if="field.type !== 'dropdown'"
        :name="field.name" 
        :placeholder="field.placeholder"
        :type="field.type"        
        v-model="field.model"
        mode="transparent"
        />
        <Dropdown v-else mode="transparent"  v-model="field.model" :placeholder="field.placeholder" :items="field.items" />
    </div>
    <div class="create-form__btns">
      <Button @click="emits('submit')" :disabled="!isValid" label="Отправить" full />
      <Button @click="emits('cancel')" label="Отмена" mode="secondary" full />
    </div>
  </form>
</Card>
</template>

<script setup>
import Button from '../Button';
import Card from '../Card';
import Dropdown from '../Dropdown';
import Input from '../Input';

defineProps({
  fields: {
    type: Array
  },
  title: String,
  isValid: Boolean
})

const emits = defineEmits(['submit', 'cancel'])

</script>

<style lang="scss" scoped>
.create-form {
  display: grid;
  gap: 20px;

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