import apiClient from './apiClient.js';

export async function fetchAssets() {
  const { data } = await apiClient.get('/assets');
  return data;
}

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories');
  return data;
}

export async function fetchVendors() {
  const { data } = await apiClient.get('/vendors');
  return data;
}

export async function fetchLocations() {
  const { data } = await apiClient.get('/locations');
  return data;
}

export async function createAsset(payload) {
  const { data } = await apiClient.post('/assets', payload);
  return data;
}
