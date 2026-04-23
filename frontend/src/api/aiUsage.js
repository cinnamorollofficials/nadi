import apiClient from "./client";

/**
 * Fetch the current user's actual Gemini AI usage stats.
 * @param {number} days - Number of days for history (default 7)
 */
export const getMyUsage = async (days = 7) => {
  const response = await apiClient.get(`/ai/me/usage?days=${days}`);
  return response.data.data;
};
