import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import { StatCardSkeleton, ChartCardSkeleton } from '../../components/common/Loader.jsx';
import { ToastContainer } from '../../components/common/Toast.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline.jsx';
import UpcomingReturns from '../../components/dashboard/UpcomingReturns.jsx';
import NotificationsPanel from '../../components/dashboard/NotificationsPanel.jsx';
import AssetDistributionChart from '../../components/dashboard/charts/AssetDistributionChart.jsx';
import MonthlyUsageChart from '../../components/dashboard/charts/MonthlyUsageChart.jsx';
import DepartmentUtilizationChart from '../../components/dashboard/charts/DepartmentUtilizationChart.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardSummary } from '../../services/dashboardService.js';
import { STAT_CARDS } from '../../utils/mockData.js';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, dismissToast } = useToast();
  const { user } = useAuth();

  // Simulates the initial `GET /dashboard` call. Widgets below currently
  // read from utils/mockData.js directly; once the API is live, swap them
  // to receive their slice of this response as props instead.
  useEffect(() => {
    let mounted = true;
    getDashboardSummary().then(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleQuickAction = (action) => {
    showToast(`${action.label} — page coming soon in the next build step.`, 'info');
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onClose={dismissToast} />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
            Welcome back{user?.name ? `, ${user.name}` : ''} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening across your assets today.
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STAT_CARDS.map((stat, i) => <StatCard key={stat.key} {...stat} delay={i * 0.05} />)}
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <QuickActions onAction={handleQuickAction} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-6">
        {loading ? (
          <>
            <ChartCardSkeleton />
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </>
        ) : (
          <>
            <AssetDistributionChart />
            <MonthlyUsageChart />
            <DepartmentUtilizationChart />
          </>
        )}
      </div>

      {/* Activity + Notifications */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 mb-6">
        <div className="lg:col-span-7">
          <ActivityTimeline />
        </div>
        <div className="lg:col-span-5">
          <NotificationsPanel />
        </div>
      </div>

      <UpcomingReturns />
    </DashboardLayout>
  );
}
