<script setup>
import { computed } from 'vue';
import { useField } from 'vee-validate';
import { usePasswordToggle } from '@/widgets/AuthForm/model/composables/usePasswordToggle';
import IconButton from '../IconButton';
import FieldError from '../FieldError';



const props = defineProps({
  name: String,
  type: String,
  placeholder: String,
  label: String,
  errorPosition: String,
  icon: Object,
  disabled: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  mask: {
    type: String,
    default: ''
  }
})

const normalizedValue = computed({
  get: () => value.value,
  set: (newVal) => {
    if (!newVal) {
      value.value = newVal;
      return;
    }
    // Оставляем только цифры и обрезаем до 11
    const digitsOnly = newVal.replace(/\D/g, '').slice(0, 11);
    // Здесь можно также применить маску, если нужно, но для хранения лучше чистые цифры
    value.value = digitsOnly;
  }
});

const { value, errorMessage, handleBlur } = useField(() => props.name, undefined, {
  validateOnValueUpdate: false
})

const password = usePasswordToggle(props.type)
const inputType = computed(() => password.inputType.value)
const inputIcon = computed(() => password.icon.value ?? props.icon)

</script>

<template>
  <div class="field">
    <div 
      class="input-wrapper" 
      :class="{
        'has-error': errorMessage,
        'has-icon': inputIcon
    }">
      <label v-if="label">{{ label }}</label>
      <input 
       v-if="inputType === 'tel' && mask !== ''"
        class="input" 
        v-imask="{ mask, lazy: false }"
        v-model="normalizedValue"
        :type="inputType" 
        :placeholder="placeholder" 
        :disabled="disabled"
        :autocomplete="autocomplete"
        @blur="handleBlur($event, true)"
        >
        <input 
        v-else-if="inputType !== 'textarea'"
        class="input" 
        v-model="value" 
        :type="inputType" 
        :placeholder="placeholder" 
        :disabled="disabled"
        :autocomplete="autocomplete"
        @blur="handleBlur($event, true)"
        >
        <textarea v-else :placeholder="placeholder" class="input"></textarea>
      <div v-if="inputIcon" class="field__buttons">
        <IconButton @click="password.toggle" size="20px"  :icon-component="inputIcon" />
      </div>
    </div>
    <FieldError v-if="errorMessage" :error="errorMessage" :position="errorPosition" />
  </div>
</template>


<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
  row-gap: 15px;
  position: relative;
   
  border-radius: var(--border-radius-xs);
  transition: all var(--transition-duration) ease;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);

  &.has-error {
    border: 1px solid var(--color-error);
  }

  &.has-icon {
    padding-right: 40px;
  }
}


.input {
  @include fluid-text(14, 12);

  padding: var(--padding-x);
  width: 100%;
  outline: 0;
  border: 0;
  user-select: none;
  font-weight: 300;
  border-radius: var(--border-radius-xs);
  color: var(--color-primary);
  resize: none;

  &:disabled {
    cursor: not-allowed;
    background-color: #f5f5f5;
    opacity: .7;
  }
}

.field__buttons {
  @include flex-center;

  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}


.textarea {
  resize: none;
  min-height: 130px;
}
</style>