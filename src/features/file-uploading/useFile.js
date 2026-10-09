import { ref } from "vue";

export function useFile(inputRef) {
  const isUploading = ref(false);
  const uploadError = ref(null);
  const files = ref(null)

  const uploadFile = async (uploadFunction) => {
    if (!inputRef.value || inputRef.value.files.length === 0) {
      uploadError.value = "No file selected";
      return null;
    }

    const file = inputRef.value.files[0];
    isUploading.value = true;
    uploadError.value = null;


    try {
      // const result = await uploadFunction(file);
      files.value = file
      return file;
    } catch (error) {
      uploadError.value = error.message || "File upload failed";
      return null;
    } finally {
      isUploading.value = false;
    }
  };

   const createPreviewUrl = (file) => {
    return URL.createObjectURL(file);
  };


  return {
    isUploading,
    files,
    createPreviewUrl,
    uploadError,
    uploadFile,
  };

}
