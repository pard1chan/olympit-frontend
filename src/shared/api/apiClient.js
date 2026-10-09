import { apiConfig } from "./api.config";
import { api } from "./axiosInstance";

export class ApiClient {
  async get(url, config, retryCount = 0) {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.get(url, config, retryCount + 1);
      }
      throw error;
    }
  }

  async post(url, data, config, retryCount = 0) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.post(url, data, config, retryCount + 1);
      }
      throw error;
    }
  }

  async put(url, data, config, retryCount = 0) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.put(url, data, config, retryCount + 1);
      }
      throw error;
    }
  }

  async patch(url, data, config, retryCount = 0) {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.patch(url, data, config, retryCount + 1);
      }
      throw error;
    }
  }

  async delete(url, config, retryCount = 0) {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.delete(url, config, retryCount + 1);
      }
      throw error;
    }
  }

  async uploadFile(url, file, fieldName = "file", additionalData, onProgress) {
    const formData = new FormData();
    
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
     
    });

    return response.data;
  }

   /**
   * Download a file with progress tracking
   * @param {string} url - Full URL or relative path
   * @param {Object} config - Axios config
   * @param {Function} onProgress - Progress callback
   */

  async downloadFile(url, config = {}, onProgress = null) {
     const baseUrl = apiConfig.baseURL.split('/api/v1')[0]
    
    const fullUrl = `${baseUrl}${url.fileUrl || url.videoUrl}`
    

    try {
      const response = await api.get(fullUrl, {
        ...config,
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted, progressEvent);
          }
        },
      });

      

      return response;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }

    /**
   * Download file and trigger browser download
   * @param {string} url - File URL
   * @param {string} filename - Custom filename
   * @param {Object} config - Axios config
   * @param {Function} onProgress - Progress callback
   */
  async downloadFileAndSave(url, filename = null, config = {}, onProgress = null) {
    try {
      const response = await this.downloadFile(url, config, onProgress);
      // Extract filename from headers or use provided
      const finalFilename = filename 
      || this.extractFilename(response, url);
      
      // Create download link and trigger download
      
      this.triggerBrowserDownload(response.data, finalFilename);
      
      return {
        success: true,
        filename: finalFilename,
        blob: response.data,
        headers: response.headers,
        status: response.status
      };
    } catch (error) {
      console.error('Download and save error:', error);
      throw error;
    }
  }

    /**
   * Download multiple files
   * @param {Array} urls - Array of file URLs
   * @param {Array} filenames - Array of custom filenames (optional)
   * @param {Object} config - Axios config
   */
  async downloadMultipleFiles(urls, filenames = [], config = {}) {
    const downloadPromises = urls.map((url, index) => {
      const filename = filenames[index] || null;
      return this.downloadFileAndSave(url, filename, config);
    });

    return Promise.allSettled(downloadPromises);
  }

  prepareUrl(url) {
    // If URL is relative, prepend base URL
    const baseUrl = apiConfig.baseURL.split('/api/v1')[0]
    if (url.startsWith('/')) {
      return `${apiConfig.baseURL}${url}`;
    }
    return url;
  }

  extractFilename(response, url) {
    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    
    if (contentDisposition) {
      const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
      const asciiFilenameRegex = /filename=(["']?)([^"'\n]+)\1(?:; ?|$)/i;
      
      let match = contentDisposition.match(utf8FilenameRegex);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
      
      match = contentDisposition.match(asciiFilenameRegex);
      if (match && match[2]) {
        return match[2];
      }
    }
    
    // Extract from URL
    const urlParts = url.fileUrl.split('/');
    let filename = urlParts.pop();
    
    // Remove query parameters if present
    const queryIndex = filename.indexOf('?');
    if (queryIndex !== -1) {
      filename = filename.substring(0, queryIndex);
    }
    
    // URL decode
    filename = decodeURIComponent(filename);
    
    return filename || 'file';
  }

  // Метод для отправки нескольких файлов
  async uploadMultipleFiles(
    url,
    files,
    fieldName = "files",
    additionalData,
    onProgress,
  ) {
    const formData = new FormData();

    // Добавляем все файлы
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  }

  triggerBrowserDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

   /**
   * Get file info without downloading
   * @param {string} url - File URL
   * @param {Object} config - Axios config
   */
  async getFileInfo(url, config = {}) {
    const fullUrl = this.prepareUrl(url);
    
    try {
      const response = await api.head(fullUrl, config);
      
      return {
        exists: true,
        size: response.headers['content-length'],
        type: response.headers['content-type'],
        lastModified: response.headers['last-modified'],
        filename: this.extractFilenameFromHeaders(response.headers, url),
        headers: response.headers
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  }

   async streamDownload(url, config = {}, onChunk = null, onComplete = null) {
    const fullUrl = this.prepareUrl(url);
    
    try {
      const response = await fetch(fullUrl, {
        ...config,
        headers: {
          ...api.defaults.headers.common,
          ...config.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        if (onChunk) {
          onChunk(value, receivedLength);
        }
      }

      const blob = new Blob(chunks);
      
      if (onComplete) {
        onComplete(blob, receivedLength);
      }

      return blob;
    } catch (error) {
      console.error('Stream download error:', error);
      throw error;
    }
  }


  // Метод для отправки данных в формате FormData (не только файлы)
  async sendFormData(url, formData, config = {}, retryCount = 0) {
    try {
      const response = await api.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.sendFormData(url, formData, config, retryCount + 1);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  shouldRetry(error) {
    return (
      !error.response ||
      error.response.status === 429 || // Rate limit
      error.response.status >= 500 || // Server errors
      error.code === "ECONNABORTED" // Timeout
    );
  }

  // Создание токена для отмены запросов
  createCancelToken() {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  }

  // Универсальный метод запроса для сложных случаев
  async request(config, retryCount = 0) {
    try {
      const response = await api.request(config);
      return response.data;
    } catch (error) {
      if (this.shouldRetry(error) && retryCount < apiConfig.retry.maxRetries) {
        await this.delay(apiConfig.retry.retryDelay);
        return this.request(config, retryCount + 1);
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
