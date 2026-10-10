import api from './api';

export const submissionService = {
  async runCode(challengeId, code) {
    const response = await api.post('/submissions/run', { challengeId, code });
    return response.data;
  },

  async submitCode(challengeId, code, hintsUsedCount = 0) {
    const response = await api.post('/submissions/submit', { challengeId, code, hintsUsedCount });
    return response.data;
  },

  async getUserSubmissions() {
    const response = await api.get('/submissions/user');
    return response.data;
  },

  async getChallengeSubmissions(challengeId) {
    const response = await api.get(`/submissions/challenge/${challengeId}`);
    return response.data;
  }
};
