<template>
  <nav class="nav">
    <ul class="nav__list">
      <li v-for="link in links" class="nav__item" :key="link.name">
        <router-link @click="handleNavClick" :to="{ name: link.name }" class="nav__link">{{ link.label }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>


const props = defineProps({
  links: {
    type: Array,
    required: true
  },
  mobileMenuControl: {
    type: Object,
    default: null
  }
})




const handleNavClick = (event) => {
  if (props.mobileMenuControl?.close) {
    props.mobileMenuControl.close()
  }
}
</script>

<style lang="scss" scoped>
.nav {
  @include tablet-above {
    padding-block: fluid-to-laptop(10, 8);
  }

  @include tablet {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  &__list {
    display: flex;
    align-items: center;
    gap: 0 30px;

    @include tablet {
      flex-direction: column;
      row-gap: 23px;
      margin-block: auto;
    }
  }

  &__link {
    color: var(--link-color);

    @include fluid-text(16, 14);

    &.is-active {
      font-weight: 600;
      pointer-events: none;
    }

    @include hover {
      color: var(--color-primary-darken);
    }

    @include tablet {
      font-size: 20px;
    }
  }
}
</style>