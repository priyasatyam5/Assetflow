import apiClient from './apiClient.js';
import {
  STAT_CARDS,
  ASSET_DISTRIBUTION,
  MONTHLY_USAGE,
  DEPARTMENT_UTILIZATION,
  RECENT_ACTIVITY,
  UPCOMING_RETURNS,
  NOTIFICATIONS,
} from '../utils/mockData.js';

/**
 * PLACEHOLDER DASHBOARD SERVICE
 * Mirrors the expected `GET /dashboard` contract. Runs in mock mode until
 * the Express backend is live — flip MOCK_MODE to false and point
 * VITE_API_BASE_URL at the real API to switch over with no component changes.
 */
const MOCK_MODE = false;

function mockDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboardSummary() {
  if (MOCK_MODE) {
    await mockDelay();
    return {
      stats: STAT_CARDS,
      assetDistribution: ASSET_DISTRIBUTION,
      monthlyUsage: MONTHLY_USAGE,
      departmentUtilization: DEPARTMENT_UTILIZATION,
      recentActivity: RECENT_ACTIVITY,
      upcomingReturns: UPCOMING_RETURNS,
      notifications: NOTIFICATIONS,
    };
  }

  // Real integration:
  const { data } = await apiClient.get('/dashboard');
  return data;
}
