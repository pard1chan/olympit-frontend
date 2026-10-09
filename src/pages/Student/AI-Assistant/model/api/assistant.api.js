import { apiClient } from "@/shared/api/apiClient";

export const assistantApi = {
  async sendMessageToAssistant(message, fileUrl = null) {
    const params = {};

    if (fileUrl) params.fileUrl = fileUrl;

    return await apiClient.post(
      "/chat/message",
      {
        message: message,
        subject: "",
      },
      {
        params: params,
      },
    );
  },

  async fetchChatHistory() {
    return await apiClient.get("/chat/history");
  },

  async analyzeLastTest() {
    return await apiClient.post("/tests/analyze-last");
  },

  async uploadFileInChat(file, onProgress = null) {
    return await apiClient.uploadFile("/chat/upload-file", file);
  },
};
