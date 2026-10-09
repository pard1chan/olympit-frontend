<script setup>
import AuthForm from '@/widgets/AuthForm/';
</script>

<template>
  <div class="auth">
    <AuthForm />
  </div>
</template>


<style lang="scss" scoped>
.auth {
  padding-block: 20px;
  display: grid;
  place-items: center;
  min-height: 100dvh;
}
</style>