import apiClient from './apiClient.js';

export async function fetchActiveAuditCycle() {
  const { data } = await apiClient.get('/audit-cycles/active');
  return data;
}

export async function closeAuditCycle(id) {
  const { data } = await apiClient.post(`/audit-cycles/${id}/close`);
  return data;
}
