<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <router-link :to="{ name: 'home' }">Вернуться на главную</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}
h1 {
  font-size: 6rem;
  margin: 0;
}
p {
  font-size: 1.5rem;
  color: #666;
}
a {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--color-pink);
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>