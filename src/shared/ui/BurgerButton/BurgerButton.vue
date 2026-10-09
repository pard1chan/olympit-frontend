<template>
  <button type="button" class="burger-button visible-tablet">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor"
        d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m1 5a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2z" />
    </svg>
  </button>
</template>


<style lang="scss" scoped>
.burger-button {
  @include flex-center(true);
  @include square(51px);

  padding: 0;
  background-color: transparent;
  border: 0;
  border-radius: var(--border-radius-xs);

  @include hover {
    background-color: var(--bg-color);
    border-color: transparent;
  }

  &.is-active {}

  &:not(.is-active) {}

}
</style>