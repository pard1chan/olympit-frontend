import { ref } from "vue";

export function useFileInput() {
  const inputRef = ref(null);

  const triggerClick = (disabled = false) => {
    if (!disabled && inputRef.value) {
      inputRef.value.click();
    }
  };

  const resetInput = () => {
    if (inputRef.value) {
      inputRef.value.value = null;
    }
  };

  const getFiles = (event, multiple = false) => {
    const files = event.target.files;
    if (!files.length) return null;
    return multiple ? Array.from(files) : files[0];
  };

  return {
    inputRef,
    triggerClick,
    resetInput,
    getFiles,
  };
}
