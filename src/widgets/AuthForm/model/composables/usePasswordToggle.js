import { IconEyeOff, IconEyeOn } from "@/shared/ui/Icons";
import { computed, ref, unref } from "vue";

export const usePasswordToggle = (type) => {
  const visible = ref(false);

  const isPassword = computed(() => unref(type) === "password");

  const toggle = () => {
    if (!isPassword.value) return;
    visible.value = !visible.value;
  };

  const inputType = computed(() => {
    if (!isPassword.value) return unref(type);
    return visible.value ? "text" : "password";
  });

  const icon = computed(() => {
    if (!isPassword.value) return undefined;
    return visible.value ? IconEyeOn : IconEyeOff;
  });

  return {
    visible,
    toggle,
    inputType,
    icon,
    isPassword
  };
};
