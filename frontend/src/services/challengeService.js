import api from './api';

export const challengeService = {
  async getChallenges(filters = {}) {
    const params = new URLSearchParams();
    if (filters.language) params.append('language', filters.language);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.bugType) params.append('bugType', filters.bugType);

    const response = await api.get(`/challenges?${params.toString()}`);
    return response.data;
  },

  async getChallengeById(id) {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },

  async createChallenge(challengeData) {
    const response = await api.post('/challenges', challengeData);
    return response.data;
  }
};
