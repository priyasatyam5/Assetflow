import { useAuth } from '../../context/AuthContext.jsx';
import { FiBox, FiGrid, FiUsers, FiShield, FiActivity, FiLogOut, FiSearch, FiBell, FiPlus, FiArrowUpRight } from 'react-icons/fi';
import { NAV_ITEMS } from '../../utils/mockData.js';

const QUICK_STATS = [
  { label: 'Total Assets', value: '12,485', change: '+4.2%', icon: FiBox, color: 'text-primary' },
  { label: 'Active Allocations', value: '3,240', change: '+1.8%', icon: FiGrid, color: 'text-accent' },
  { label: 'Departments', value: '38', change: '0%', icon: FiUsers, color: 'text-purple-500' },
  { label: 'Pending Requests', value: '142', change: '-6%', icon: FiActivity, color: 'text-amber-500' },
];

const RECENT_ACTIVITY = [
  { action: 'MacBook Pro M3 assigned to Priya Shah', dept: 'Engineering', time: '2 min ago' },
  { action: 'Meeting Room A projector replaced', dept: 'Facilities', time: '18 min ago' },
  { action: 'Inventory audit completed — Floor 2', dept: 'Warehouse', time: '1 hr ago' },
  { action: 'Dell UltraSharp monitor transferred to HQ', dept: 'IT Dept', time: '3 hr ago' },
];

const QUICK_ACTIONS = [
  { label: 'Add Asset', icon: FiPlus, desc: 'Register a new asset' },
  { label: 'New Allocation', icon: FiUsers, desc: 'Assign to employee' },
  { label: 'Run Report', icon: FiActivity, desc: 'Generate insights' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
              <FiBox className="text-lg" />
            </div>
            <span className="font-display text-lg font-bold text-ink dark:text-ink-dark">
              AssetFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search assets, people…"
                className="w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-9 py-2 text-sm text-ink dark:text-ink-dark placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <FiBell className="text-base" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* User & Logout */}
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-ink dark:text-ink-dark leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'employee'}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-white text-sm font-bold shadow-glow">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-slate-500 dark:text-slate-400 hover:text-danger transition-colors"
                title="Sign out"
              >
                <FiLogOut className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="glass-panel rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <FiBox className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-ink-dark">AssetFlow</p>
                <p className="text-xs text-slate-400">Enterprise Asset Management</p>
              </div>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <item.icon className="text-base" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <section>
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Here&apos;s what&apos;s happening across your organization today.
              </p>
            </div>

        {/* Quick stats */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel rounded-xl2 p-5 transition-all duration-200 hover:shadow-glass-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <stat.icon className={`text-2xl ${stat.color}`} />
                <span
                  className={`text-xs font-semibold ${
                    stat.change.startsWith('+')
                      ? 'text-success'
                      : stat.change.startsWith('-')
                        ? 'text-danger'
                        : 'text-slate-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-ink dark:text-ink-dark">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-panel rounded-xl2 p-6">
            <h2 className="font-display text-lg font-bold text-ink dark:text-ink-dark mb-4">
              Recent Activity
            </h2>
            <div className="space-y-1">
              {RECENT_ACTIVITY.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">
                      {item.action}
                    </p>
                    <p className="text-xs text-slate-400">{item.dept}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 ml-4">{item.time}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-600 transition-colors">
              View all activity <FiArrowUpRight />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel rounded-xl2 p-6">
            <h2 className="font-display text-lg font-bold text-ink dark:text-ink-dark mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary">
                    <action.icon className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink dark:text-ink-dark">
                      {action.label}
                    </p>
                    <p className="text-xs text-slate-400">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
        </div>
      </main>
    </div>
  );
}
