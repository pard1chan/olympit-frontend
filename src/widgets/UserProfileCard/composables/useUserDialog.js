import { useCropper } from "@/features/avatar-cropper/composables/useCropper";
import { nextTick } from "vue";
import { useProfile } from "../useUser";
import { useDialog } from "@/shared/lib/composables/useDialog2";
import { useFile } from "@/features/file-uploading/useFile";
import { useToasts } from "@/shared/lib/composables/useToasts";

export function useUserDialog(imageElement, preview, inputRef) {
  const { updateAvatar, isEditing } = useProfile();
  const { initialize, getCroppedImageBlob, destroy, isInitialized } =
    useCropper();
  const { dialogRef } = useDialog();
  const { createPreviewUrl, uploadFile } = useFile(inputRef);
  const toast = useToasts();

  const init = () => {
    if (imageElement.value) {
      initialize(imageElement.value);
    }
  };

  
  const saveNewAvatar = async () => {

    if (!isInitialized.value) return;

    const avatarBlob = await getCroppedImageBlob();
    
    await updateAvatar(avatarBlob);

    preview.value = null;

    closeModal();
    toast.success("Фото профиля успешно обновлено!");
  };

  const uploadNewAvatar = async () => {
    const file = await uploadFile();
    preview.value = createPreviewUrl(file);

    await nextTick();

    if (preview.value) {
      init();
    }
  };

  const openModal = () => dialogRef.value?.open();

  function closeModal() {
    destroy();
    dialogRef.value.close();
    preview.value = null;
  }

  return {
    dialogRef,

    closeModal,
    openModal,
    uploadNewAvatar,
    saveNewAvatar,
  };
}
