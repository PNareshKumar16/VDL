import api from './api';

export const aiService = {
  async getSocraticHint(challengeId, currentCode, hintLevel, errorMessage = '', failedTestCaseInput = '') {
    const response = await api.post('/ai/hint', {
      challengeId,
      currentCode,
      hintLevel,
      errorMessage,
      failedTestCaseInput
    });
    return response.data;
  }
};
