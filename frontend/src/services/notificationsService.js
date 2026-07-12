import apiClient from './apiClient.js';

export async function fetchNotifications(type) {
  const params = {};
  if (type) params.type = type;
  const { data } = await apiClient.get('/notifications', { params });
  return data;
}
