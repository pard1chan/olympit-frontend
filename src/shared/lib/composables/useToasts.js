import { useToast } from "vue-toast-notification";

export const ToastType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DEFAULT: "default",
};

export const ToastPosition = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
};

export function createToast() {
  const $toast = useToast();

  const success = (message, options) => {
    return $toast.success(message, {
      position: ToastPosition.BOTTOM_RIGHT,
      duration: 3000,
      ...options,
    });
  };

  const error = (message, options) => {
    return $toast.error(message, {
      position: ToastPosition.BOTTOM_RIGHT,
      duration: 3000,
      ...options,
    });
  };

  const warning = (message, options) => {
    return $toast.warning(message, {
      position: ToastPosition.BOTTOM_RIGHT,
      duration: 3000,
      ...options,
    });
  };

  const info = (message, options) => {
    return $toast.info(message, {
      position: ToastPosition.BOTTOM_RIGHT,
      duration: 3000,
      ...options,
    });
  };

  const show = (message, options = {}) => {
    return $toast.open({
      message,
      type: "default",
      position: ToastPosition.BOTTOM_RIGHT,
      duration: 3000,
      ...options,
    });
  };

  const clearAll = () => $toast.clear();

  return {
    success,
    error,
    warning,
    info,
    show,

    // Management
    clearAll,

    // Raw toast instance for advanced usage
    instance: $toast,
  };
}

let toastInstance = null

export function useToasts() {
  if (!toastInstance) {
    toastInstance = createToast()
  }
  return toastInstance
}
