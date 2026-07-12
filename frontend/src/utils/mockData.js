import {
  FiGrid,
  FiLayers,
  FiBox,
  FiRepeat,
  FiCalendar,
  FiTool,
  FiShield,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUserPlus,
  FiSend,
  FiPlusSquare,
  FiAlertTriangle,
  FiCode,
  FiCheckCircle,
  FiClock,
  FiTruck,
} from 'react-icons/fi';

/**
 * mockData
 * Placeholder data for the Dashboard page. Every shape here mirrors what
 * the Express API is expected to return (see services/dashboardService.js)
 * so swapping mock -> real data later is a drop-in replacement.
 */

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: FiGrid, path: '/dashboard' },
  { label: 'Organization Setup', icon: FiLayers, path: '/organization-setup' },
  { label: 'Asset Directory', icon: FiBox, path: '/assets' },
  { label: 'Allocation & Transfer', icon: FiRepeat, path: '/allocation' },
  { label: 'Resource Booking', icon: FiCalendar, path: '/resource-booking' },
  { label: 'Maintenance', icon: FiTool, path: '/maintenance' },
  { label: 'Audit', icon: FiShield, path: '/audit' },
  { label: 'Reports', icon: FiBarChart2, path: '/reports' },
  { label: 'Notifications', icon: FiBell, path: '/notifications' },
  { label: 'Settings', icon: FiSettings, path: '/settings' },
];

export const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Assets',
    value: 12480,
    change: 4.2,
    trend: 'up',
    icon: FiBox,
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    key: 'allocated',
    label: 'Allocated Assets',
    value: 8764,
    change: 2.8,
    trend: 'up',
    icon: FiSend,
    gradient: 'from-accent-500 to-accent-700',
  },
  {
    key: 'available',
    label: 'Available Assets',
    value: 3204,
    change: -1.6,
    trend: 'down',
    icon: FiCheckCircle,
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    key: 'maintenance',
    label: 'Under Maintenance',
    value: 312,
    change: 6.1,
    trend: 'up',
    icon: FiTool,
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    key: 'pending',
    label: 'Pending Transfers',
    value: 47,
    change: -3.4,
    trend: 'down',
    icon: FiTruck,
    gradient: 'from-rose-500 to-rose-600',
  },
  {
    key: 'bookings',
    label: 'Resource Bookings',
    value: 156,
    change: 8.9,
    trend: 'up',
    icon: FiCalendar,
    gradient: 'from-violet-500 to-violet-700',
  },
];

export const QUICK_ACTIONS = [
  { key: 'register', label: 'Register Asset', icon: FiPlusSquare, color: 'text-primary', path: '/assets/register' },
  { key: 'allocate', label: 'Allocate Asset', icon: FiSend, color: 'text-accent', path: '/allocation' },
  { key: 'book', label: 'Book Resource', icon: FiCalendar, color: 'text-violet-600', path: '/resource-booking' },
  { key: 'maintenance', label: 'Raise Maintenance Request', icon: FiTool, color: 'text-amber-600', path: '/maintenance/new' },
  { key: 'qr', label: 'Generate QR Code', icon: FiCode, color: 'text-rose-600', path: '/assets/qr' },
];

export const ASSET_DISTRIBUTION = [
  { name: 'Laptops', value: 4120, color: '#2563EB' },
  { name: 'Furniture', value: 3210, color: '#14B8A6' },
  { name: 'Vehicles', value: 860, color: '#F59E0B' },
  { name: 'Electronics', value: 2740, color: '#8B5CF6' },
  { name: 'Others', value: 1550, color: '#94A3B8' },
];

export const MONTHLY_USAGE = [
  { month: 'Jan', allocated: 620, returned: 180 },
  { month: 'Feb', allocated: 710, returned: 210 },
  { month: 'Mar', allocated: 660, returned: 240 },
  { month: 'Apr', allocated: 790, returned: 260 },
  { month: 'May', allocated: 845, returned: 300 },
  { month: 'Jun', allocated: 905, returned: 340 },
  { month: 'Jul', allocated: 960, returned: 365 },
];

export const DEPARTMENT_UTILIZATION = [
  { month: 'Jan', engineering: 62, facilities: 48, fieldOps: 40 },
  { month: 'Feb', engineering: 66, facilities: 51, fieldOps: 44 },
  { month: 'Mar', engineering: 71, facilities: 49, fieldOps: 47 },
  { month: 'Apr', engineering: 75, facilities: 54, fieldOps: 52 },
  { month: 'May', engineering: 79, facilities: 58, fieldOps: 55 },
  { month: 'Jun', engineering: 84, facilities: 61, fieldOps: 59 },
  { month: 'Jul', engineering: 88, facilities: 63, fieldOps: 62 },
];

export const RECENT_ACTIVITY = [
  {
    id: 'act_1',
    icon: FiSend,
    tone: 'primary',
    title: 'Laptop AF-0114 allocated to Priya Shah',
    meta: 'IT Department · 10 minutes ago',
  },
  {
    id: 'act_2',
    icon: FiCalendar,
    tone: 'violet',
    title: 'Room B2 booking confirmed',
    meta: '2:00 PM – 3:00 PM · 32 minutes ago',
  },
  {
    id: 'act_3',
    icon: FiTool,
    tone: 'amber',
    title: 'Projector AF-0062 maintenance resolved',
    meta: 'Facilities · 1 hour ago',
  },
  {
    id: 'act_4',
    icon: FiRepeat,
    tone: 'accent',
    title: 'Office Chair AF-0201 transferred to Warehouse',
    meta: 'Logistics · 3 hours ago',
  },
  {
    id: 'act_5',
    icon: FiCheckCircle,
    tone: 'success',
    title: 'Dell Monitor AF-0187 returned and inspected',
    meta: 'Asset Desk · Yesterday',
  },
];

export const UPCOMING_RETURNS = [
  { id: 'AF-0114', asset: 'Dell Latitude 5440', employee: 'Priya Shah', date: 'Jul 15, 2026', status: 'On Track' },
  { id: 'AF-0062', asset: 'Epson Projector', employee: 'Rohan Mehta', date: 'Jul 14, 2026', status: 'Overdue' },
  { id: 'AF-0201', asset: 'Ergonomic Office Chair', employee: 'Sana Iqbal', date: 'Jul 18, 2026', status: 'On Track' },
  { id: 'AF-0330', asset: 'MacBook Pro 16"', employee: 'Aditi Rao', date: 'Jul 12, 2026', status: 'Due Today' },
  { id: 'AF-0098', asset: 'Conference Room B2', employee: 'Team Engineering', date: 'Jul 20, 2026', status: 'On Track' },
];

export const NOTIFICATIONS = [
  {
    id: 'ntf_1',
    icon: FiAlertTriangle,
    tone: 'danger',
    title: 'Maintenance reminder',
    message: 'Projector AF-0062 service window closes in 2 days.',
    time: '10m ago',
  },
  {
    id: 'ntf_2',
    icon: FiClock,
    tone: 'warning',
    title: 'Pending approval',
    message: 'Transfer request TR-1042 awaiting your sign-off.',
    time: '45m ago',
  },
  {
    id: 'ntf_3',
    icon: FiBox,
    tone: 'primary',
    title: 'Asset due today',
    message: 'MacBook Pro AF-0330 is due for return today.',
    time: '2h ago',
  },
];
