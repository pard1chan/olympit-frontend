<template>
  <label class="input-wrapper label" :class="classes">
    {{ label }}
    <input 
     v-if="type != 'textarea'"
      @blur="emit('blur', $event)" 
      @change="emit('change', $event)" 
      @input="onInput" 
      @keydown.enter="emit('keydown')" 
      :value="model" 
      :id="id"
      :type="type" 
      :placeholder="placeholder" 
      :inputmode="inputMode" 
      :disabled="disabled" 
      class="input" 
      />
  <textarea v-else :placeholder="placeholder" :value="model" @input="onInput" class="input textarea"></textarea>

    <div class="label__buttons">
      <!-- <IconButton 
        :icon-component="icons"
        :size="icons.size || iconSize" 
        @click="(e) => handleIconClick(icons, index, e)" 
        /> -->
        <IconButton 
        v-if="icons instanceof Array"
        v-for="icon in icons"
        :icon-component="icon.icon"
        :size="icons.size || iconSize" 
        @click="(e) => handleIconClick(icon, index, e)" 
        />
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue';
import IconButton from '../IconButton/IconButton.vue';


const props = defineProps({
  placeholder: String,
  label: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: 'text'
  },
  inputMode: {
    type: String,
    default: 'text'
  },
  icons: {
    type: [Array, Object],
    default: () => [],
    required: false
  },
  error: String,
  disabled: Boolean,
  id: String,
  iconSize: {
    type: String,
    default: '30px',
  },
  mode: {
    type: String,
    default: ''
  },
  size: {
    default: 's',
    type: String
  }
});

const model = defineModel();
const emit = defineEmits(['icon-click', 'blur', 'input', 'change', 'keydown']);


const classes = computed(() => ({
  [`label--${props.mode}`]: props.mode,
  [`label--size-${props.size}`]: props.size,
  'has-icon': props.icons,
  'has-error': !!props.error,
  'is-disabled': props.disabled,
}))

const onInput = (event) => {
  model.value = event.target.value;
  emit('input', event);
};



const handleIconClick = (icon, index, event) => {
  emit('icon-click', {
    icon,
    index,
    value: model.value,
    event
  });
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  transition: all var(--transition-duration) ease;

  &.has-icon {
    .input {
      padding-right: 20px;
    }
  }

  &.has-error {

    border: 1px solid var(--color-error);

    .input {
      &:disabled {
        background-color: rgba(var(--color-error-rgb), 0.01);
      }
    }
  }
}

.label {
  padding: var(--padding-x);
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 15px;

  border-radius: var(--border-radius-xs);
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
  font-weight: 300;
  @include fluid-text(14, 12);
  color: var(--color-primary);

  &--transparent {
    background-color: transparent;
    border: 1px solid #e9ecef;
    box-shadow: none;
  }

  &--transparent-outline {
    background-color: transparent;
    box-shadow: none;
    border: var(--border);
  }


  &--size-xs {
    padding: 8px 12px;
  }




  &__buttons {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.input {
  user-select: none;
  border: 0;
  outline: 0;
  width: 100%;

  &:focus-visible {
    @include focus-visible;
  }
}

.icon-button {
  width: v-bind('props.iconSize');
  height: v-bind('props.iconSize');

  cursor: pointer;
  padding: 6px;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    border-radius: 4px;
  }
}

.textarea {
  resize: none;
  min-height: 130px;
}
</style>