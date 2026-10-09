import { ref } from "vue";

export function useSidebar() {
  const sidebar = ref(null);
  const isOpen = ref(true);

  const open = () => {
    document.documentElement.classList.add("is-lock");
    isOpen.value = true;
  };

  const close = () => {
    document.documentElement.classList.remove("is-lock");
    isOpen.value = false;
  };

  return {
    sidebar,
    isOpen,

    open,
    close,
  };
}
