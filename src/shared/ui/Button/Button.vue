<template>
  <button @click="handleClick" class="btn" v-if="type === 'button'" :class="btnClasses" :disabled="disabled">
    <span v-if="label">{{ label }}</span>
    <slot />
    <component class="icon" :is="icon" />
  </button>
  <router-link v-else :to="link" class="btn" :class="btnClasses">{{ label }}</router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    required: false,
    type: String
  },
  mode: {
    required: false,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hideOnMobile: {
    type: Boolean,
    required: false,
    default: false,
  },
  full: {
    type: Boolean,
    default: false,
    required: false
  },
  icon: Object,
  type: {
    default: 'button',
    type: String
  },
  link: {
    required: false,
    type: Object
  },
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.disabled) return;
  emit('click', event)
}

const btnClasses = computed(() => ({
  [`btn--${props.mode}`]: props.mode,
  'btn--disabled': props.disabled,
  'btn--hide-on-mobile': props.hideOnMobile,
  'btn--full': props.full,
  [`btn--color-${props.color}`]: props.color
}))
</script>

<style lang="scss" scoped>
.btn {
  padding: 12px fluid(55, 28);

  @include flex-center(true);
  @include fluid-text(16, 14);

  border: 0;
  border-radius: var(--border-radius-l);
  background-color: var(--color-pink);
  color: var(--color-white);
  font-weight: 600;
  user-select: none;

  &--disabled {
    cursor: not-allowed;
  }

  @include hover {
    background-color: darken(#FFA3C4, 10%);
  }


  &--transparent {
    background-color: transparent;

    @include hover {
      background-color: #f6f6f6;
    }
  }

  &--icon {
    padding: 12px fluid(20, 10);
    background-color: transparent;

    @include hover {
      filter: brightness(0.95);
      background-color: transparent;
    }

  }

  &--hide-on-mobile {
    @include mobile {
      span {
        display: none;
      }
    }
  }

  &--full {
    width: 100%;
  }

  &--secondary {
    background-color: transparent;
    color: var(--color-pink);
    border: 1px solid var(--color-pink);

    @include hover {
      background-color: var(--color-pink);
      color: var(--color-white);
    }
  }

  &--danger {
    background-color: transparent;
    color: #ff0a54;
    border: 1px solid #ff0a54;

    @include hover {
      background-color: #ff0a54;
      color: var(--color-white);
    }
  }

  &--action {
    background-color: transparent;
    color: #f283b6;
    border: 1px solid #f283b6;

    @include hover {
      background-color: #f283b6;
      color: var(--color-white);
    }
  }

  &--color-white {
    color: var(--color-white);
  }

  &--color-primary {
    color: var(--color-primary);
  }

}

.icon {
  color: black;
}
</style>