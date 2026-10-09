import { createApp } from "vue";
import App from "./app/App.vue";
import router from "./app/router";
import { createPinia } from "pinia";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import "@/app/styles";
import { IMaskDirective } from 'vue-imask'


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);

app.use(ToastPlugin, {
  position: "top-right",
  duration: 5000,
  dismissible: true,
  pauseOnHover: true,
});

app.directive('imask', IMaskDirective)



app.use(router).use(pinia).mount("#app");

// createApp(App).use(router).use(pinia).mount('#app')
