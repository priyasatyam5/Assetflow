import apiClient from './apiClient.js';

/** Fetch list of all assets for the dropdown */
export async function fetchAssets() {
  const { data } = await apiClient.get('/assets');
  return data;
}

/** Fetch list of all employees/users for the dropdown */
export async function fetchEmployees() {
  const { data } = await apiClient.get('/employees');
  return data;
}

/** Fetch list of all departments for the dropdown */
export async function fetchDepartments() {
  const { data } = await apiClient.get('/departments');
  return data;
}

/**
 * Fetch allocation status for a specific asset.
 * Returns { allocated: boolean, allocation: { asset, employee, department, ... } | null }
 */
export async function fetchAllocationStatus(assetId) {
  const { data } = await apiClient.get(`/allocations/asset/${assetId}/allocation-status`);
  return data;
}

/**
 * Fetch allocation history for a specific asset.
 * Returns array of { id, date, action, employeeName, departmentName, ... }
 */
export async function fetchAllocationHistory(assetId) {
  const { data } = await apiClient.get(`/allocations/asset/${assetId}/allocation-history`);
  return data;
}

/**
 * Create a new allocation.
 */
export async function createAllocation(payload) {
  const { data } = await apiClient.post('/allocations', payload);
  return data;
}

/**
 * Submit a transfer request.
 * Payload: { assetId, currentAllocationId, toEmployeeId, reason }
 */
export async function submitTransferRequest(payload) {
  const { data } = await apiClient.post('/transfer-requests', payload);
  return data;
}
