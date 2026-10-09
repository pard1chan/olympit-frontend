// composables/useFileDownload.js
import { ref } from 'vue';
import { fileDownloadService } from '../services/FileDownloadService';
import { apiClient } from '@/shared/api/apiClient';

export function useFileDownload() {
  const loading = ref(false);
  const progress = ref(0);
  const downloadQueue = ref([]);
  const activeDownloads = ref(new Set());

  /**
   * Download a single file
   */
  const downloadFile = async (courseId, materialId, filename = null, options = {}) => {
    // if (activeDownloads.value.has(filePath)) {
    //   console.warn('File already downloading:', filePath);
    //   return;
    // }

    loading.value = true;
    activeDownloads.value.add(courseId);
    
    try {
      const result = await fileDownloadService.downloadCourseMaterial(
        courseId,
         materialId, 
        filename
      );

      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error('Download failed:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      loading.value = false;
      activeDownloads.value.delete(courseId);
    }
  };

  /**
   * Download with progress tracking
   */
  const downloadFileWithProgress = async (filePath, filename = null) => {
    loading.value = true;
    progress.value = 0;
    
    try {
      const result = await apiClient.downloadFileAndSave(
        filePath,
        filename,
        {},
        (percent) => {
          progress.value = percent;
        }
      );
      
      return {
        success: true,
        progress: 100,
        ...result
      };
    } catch (error) {
      console.error('Download with progress failed:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      loading.value = false;
      progress.value = 0;
    }
  };

  /**
   * Download multiple files sequentially
   */
  const downloadMultipleSequential = async (files) => {
    const results = [];
    
    for (const file of files) {
      const result = await downloadFile(file.path, file.name);
      results.push(result);
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  };

  /**
   * Add to download queue
   */
  const addToQueue = (file) => {
    downloadQueue.value.push(file);
  };

  /**
   * Process download queue
   */
  const processQueue = async () => {
    while (downloadQueue.value.length > 0) {
      const file = downloadQueue.value.shift();
      await downloadFile(file.path, file.name);
    }
  };

  /**
   * Cancel download
   */
  const cancelDownload = (filePath) => {
    // This would require axios cancel tokens
    // For now, just remove from active downloads
    activeDownloads.value.delete(filePath);
  };

  /**
   * Get file info
   */
  const getFileInfo = async (filePath) => {
    return fileDownloadService.getFileInfo(filePath);
  };

  /**
   * Check if file exists
   */
  const fileExists = async (filePath) => {
    return fileDownloadService.fileExists(filePath);
  };

  return {
    // State
    loading,
    progress,
    downloadQueue,
    activeDownloads,
    
    // Methods
    downloadFile,
    downloadFileWithProgress,
    downloadMultipleSequential,
    addToQueue,
    processQueue,
    cancelDownload,
    getFileInfo,
    fileExists,
    
    // Helpers from service
    formatFileSize: fileDownloadService.formatFileSize,
    getFileExtension: fileDownloadService.getFileExtension,
  };
}