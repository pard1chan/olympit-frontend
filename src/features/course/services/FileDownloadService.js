import { apiClient } from "@/shared/api/apiClient";
import { useToasts } from "@/shared/lib/composables/useToasts";

export class FileDownloadService {
  constructor() {
    this.toasts = useToasts();
  }

  async downloadWithToast(courseId, materialId, filename = null, config = {}) {
    const filepath  = await apiClient.get(`/courses/${courseId}/lessons/${materialId}/files`)

    try {
      const result = await apiClient.downloadFileAndSave(filepath, filename, config);

      this.toasts.success(`Файл "${result.filename}" скачан`);

      return result;
    } catch (error) {
      let errorMessage = "Не удалось скачать файл";

      if (error.response?.status === 404) {
        errorMessage = "Файл не найден";
      } else if (error.response?.status === 403) {
        errorMessage = "Нет доступа к файлу";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Время ожидания истекло";
      } else if (error.message?.includes("Network Error")) {
        errorMessage = "Ошибка сети";
      }

      this.toasts.error(errorMessage);
      throw error;
    }
  }

  async downloadCourseMaterial(courseId, materialId, customName = null) {
    return this.downloadWithToast(courseId, materialId, customName);
  }

  async downloadCourseMaterials(materials) {
    const urls = materials.map((m) => m.path);
    const filenames = materials.map((m) => m.name || null);

    try {
      const results = await apiClient.downloadMultipleFiles(urls, filenames);

      // Check results
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (failed > 0) {
        this.toasts.warning(
          `Скачано ${successful} из ${materials.length} файлов`,
        );
      } else {
        this.toasts.success(`Все ${materials.length} файлов скачаны`);
      }

      return results;
    } catch (error) {
      this.toasts.error("Ошибка при скачивании файлов");
      throw error;
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(filePath) {
    return apiClient.getFileInfo(filePath);
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath) {
    try {
      const info = await this.getFileInfo(filePath);
      return info.exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Get file extension
   */
  getFileExtension(filePath) {
    if (!filePath) return "";
    const parts = filePath.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }
}

export const fileDownloadService = new FileDownloadService();
