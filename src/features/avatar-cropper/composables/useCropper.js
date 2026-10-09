import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { ref, onUnmounted } from "vue";

export function useCropper() {
  const cropperInstance = ref(null);
  const isInitialized = ref(false);
  const imageElementRef = ref(null);

  /**
   * Initialize cropper on an image element
   * @param {HTMLImageElement} imageElement - The image element to attach cropper to
   * @param {Object} options - Cropper.js options
   */
  const initialize = (imageElement, options = {}) => {
    if (!imageElement) return;

    // Clear previous instance if exists
    if (cropperInstance.value) {
      destroy();
    }

    imageElementRef.value = imageElement;

    const defaultOptions = {
      aspectRatio: 1, // Square by default
      viewMode: 3, // Restrict crop box to not exceed image size
      responsive: true,
      restore: true,
      autoCropArea: 1,
      modal: false,
      checkCrossOrigin: false,
      background: false,
      movable: true,
      zoomable: false,
      rotatable: false,
      scalable: false,
      dragMode: "move",
      ready: () => {
        isInitialized.value = true;
        if (options.ready) options.ready();
      },
      crop: (event) => {
        if (options.crop) options.crop(event);
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Wait for image to be fully loaded
    if (imageElement.complete) {
      isInitialized.value = true;
      createCropperInstance();
    } else {
      isInitialized.value = true;
      imageElement.onload = createCropperInstance;
    }

    function createCropperInstance() {
      cropperInstance.value = new Cropper(imageElement, mergedOptions);
    }
  };

  /**
   * Get cropped image as Blob (for file upload)
   * @param {Object} canvasOptions - Options for getCroppedCanvas
   * @returns {Promise<Blob>} - Cropped image as Blob
   */
  const getCroppedImageBlob = async (canvasOptions = {}) => {
    if (!cropperInstance.value || !isInitialized.value) {
      throw new Error("Cropper not properly initialized");
    }

    const defaultCanvasOptions = {
      width: 300,
      height: 300,
      fillColor: "#fff",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    };

    const options = { ...defaultCanvasOptions, ...canvasOptions };

    return new Promise((resolve, reject) => {
      try {
        const canvas = cropperInstance.value.getCroppedCanvas(options);

        if (!canvas) {
          reject(new Error("Failed to get cropped canvas - canvas is null"));
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/jpeg",
          0.95, // Quality
        );
      } catch (error) {
        reject(new Error(`Error getting cropped canvas: ${error.message}`));
      }
    });
  };

  /**
   * Get cropped image as Data URL (for preview)
   * @param {Object} canvasOptions - Options for getCroppedCanvas
   * @returns {string} - Data URL
   */

  /**
   * Set crop aspect ratio
   * @param {number} ratio - Aspect ratio (e.g., 1 for square, 16/9 for widescreen)
   */
  const setAspectRatio = (ratio) => {
    if (cropperInstance.value && isInitialized.value) {
      cropperInstance.value.setAspectRatio(ratio);
    }
  };

  /**
   * Reset cropper to initial state
   */
  const reset = () => {
    if (cropperInstance.value && isInitialized.value) {
      cropperInstance.value.reset();
    }
  };

  /**
   * Destroy cropper instance
   */
  const destroy = () => {
    if (cropperInstance.value) {
      cropperInstance.value.destroy();
      cropperInstance.value = null;
      isInitialized.value = false;
      imageElementRef.value = null;
    }
  };

  // Auto cleanup
  onUnmounted(() => {
    destroy();
  });

  return {
    initialize,
    getCroppedImageBlob,
    setAspectRatio,
    reset,
    destroy,
    isInitialized,
    instance: cropperInstance,
  };
}
