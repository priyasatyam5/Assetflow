import apiClient from './apiClient.js';
import { FiBox, FiGrid, FiUsers, FiActivity } from 'react-icons/fi';

const DEFAULT_STATS = [
  { label: 'Total Assets', value: '12,485', change: '+4.2%', icon: FiBox, color: 'text-primary' },
  { label: 'Active Allocations', value: '3,240', change: '+1.8%', icon: FiGrid, color: 'text-accent' },
  { label: 'Departments', value: '38', change: '0%', icon: FiUsers, color: 'text-purple-500' },
  { label: 'Pending Requests', value: '142', change: '-6%', icon: FiActivity, color: 'text-amber-500' },
];

const DEFAULT_RECENT_ACTIVITY = [
  { action: 'MacBook Pro M3 assigned to Priya Shah', dept: 'Engineering', time: '2 min ago' },
  { action: 'Meeting Room A projector replaced', dept: 'Facilities', time: '18 min ago' },
  { action: 'Inventory audit completed — Floor 2', dept: 'Warehouse', time: '1 hr ago' },
  { action: 'Dell UltraSharp monitor transferred to HQ', dept: 'IT Dept', time: '3 hr ago' },
];

export async function getDashboardSummary() {
  try {
    const [assetsResponse, allocationsResponse, maintenanceResponse, activityResponse] = await Promise.all([
      apiClient.get('/dashboard/assets-summary'),
      apiClient.get('/dashboard/allocations-summary'),
      apiClient.get('/dashboard/maintenance-alerts'),
      apiClient.get('/dashboard/user-activity'),
    ]);

    const assetsSummary = assetsResponse.data || {};
    const allocationsSummary = allocationsResponse.data || {};
    const maintenanceAlerts = maintenanceResponse.data || [];
    const activity = activityResponse.data || [];

    return {
      stats: [
        { label: 'Total Assets', value: Number(assetsSummary.totalAssets || 0).toLocaleString(), change: '+4.2%', icon: FiBox, color: 'text-primary' },
        { label: 'Active Allocations', value: Number(allocationsSummary.activeAllocations || 0).toLocaleString(), change: '+1.8%', icon: FiGrid, color: 'text-accent' },
        { label: 'Departments', value: '38', change: '0%', icon: FiUsers, color: 'text-purple-500' },
        { label: 'Pending Requests', value: String(maintenanceAlerts.length || 0), change: '-6%', icon: FiActivity, color: 'text-amber-500' },
      ],
      recentActivity: activity.slice(0, 4).map((item) => ({
        action: item.asset ? `${item.asset.name || 'Asset'} updated` : 'Asset activity updated',
        dept: item.employee?.name || 'Operations',
        time: 'Just now',
      })),
    };
  } catch (error) {
    console.warn('Dashboard API unavailable, using fallback data.', error);
    return {
      stats: DEFAULT_STATS,
      recentActivity: DEFAULT_RECENT_ACTIVITY,
    };
  }
}
