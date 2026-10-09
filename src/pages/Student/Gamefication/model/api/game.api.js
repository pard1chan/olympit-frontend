import { apiClient } from "@/shared/api/apiClient";

export const gameApi = {
  async getUserBattles() {
    return await apiClient.get("/battles");
  },

  async getBattleById(id) {
    return await apiClient.get(`/battles/${id}`);
  },

  async usersRating() {
    return await apiClient.get("/battles/students-stats");
  },

  async createBattle(data) {
    return await apiClient.post("/battles", data);
  },

  async startBattle(id) {
    return await apiClient.post(`/battles/${id}/start`);
  },
  async finishBattle(id, battle) {
    return await apiClient.post(`/battles/${id}/finish`, battle);
  },
};
