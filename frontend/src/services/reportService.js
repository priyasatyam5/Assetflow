import apiClient from './apiClient.js';

export async function fetchUtilizationByDepartment() {
  const { data } = await apiClient.get('/reports/utilization-by-department');
  return data;
}

export async function fetchMaintenanceFrequency() {
  const { data } = await apiClient.get('/reports/maintenance-frequency');
  return data;
}

export async function fetchMostUsedAssets() {
  const { data } = await apiClient.get('/reports/most-used-assets');
  return data;
}

export async function fetchIdleAssets() {
  const { data } = await apiClient.get('/reports/idle-assets');
  return data;
}

export async function fetchMaintenanceDue() {
  const { data } = await apiClient.get('/reports/maintenance-due');
  return data;
}
