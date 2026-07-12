import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiDownload,
  FiRefreshCw,
  FiTool,
  FiClock,
  FiBox,
  FiAlertTriangle,
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  fetchUtilizationByDepartment,
  fetchMaintenanceFrequency,
  fetchMostUsedAssets,
  fetchIdleAssets,
  fetchMaintenanceDue,
} from '../../services/reportService.js';

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 60) return `unused ${days}+ days`;
  if (days > 30) return `unused ${Math.floor(days / 30)}+ months`;
  return `idle ${days}d`;
}

export default function ReportsPage() {
  const [utilization, setUtilization] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [mostUsed, setMostUsed] = useState([]);
  const [idle, setIdle] = useState([]);
  const [maintenanceDue, setMaintenanceDue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchUtilizationByDepartment().catch(() => []),
      fetchMaintenanceFrequency().catch(() => []),
      fetchMostUsedAssets().catch(() => []),
      fetchIdleAssets().catch(() => []),
      fetchMaintenanceDue().catch(() => []),
    ]).then(([u, f, m, i, md]) => {
      if (cancelled) return;
      setUtilization(u);
      setFrequency(f);
      setMostUsed(m);
      setIdle(i);
      setMaintenanceDue(md);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleExport = () => {
    const rows = [
      ['Report', 'Data'],
      ['Utilization by Department', JSON.stringify(utilization)],
      ['Maintenance Frequency', JSON.stringify(frequency)],
      ['Most Used Assets', JSON.stringify(mostUsed)],
      ['Idle Assets', JSON.stringify(idle)],
      ['Maintenance Due', JSON.stringify(maintenanceDue)],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `assetflow-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const chartTooltipStyle = { borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', fontSize: 13, fontWeight: 500 };

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <FiBarChart2 className="text-primary" /> Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Utilization trends, asset usage, and maintenance insights.
          </p>
        </div>
        <button onClick={handleExport} className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
          <FiDownload /> Export Report
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-16">
          <FiRefreshCw className="animate-spin" /> Loading reports...
        </div>
      ) : (
        <>
          {/* Chart cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
              className="glass-panel rounded-xl2 p-5"
            >
              <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark mb-4">Utilization by Department</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={utilization.length > 0 ? utilization : [{ department: 'No data', allocated: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" vertical={false} />
                  <XAxis dataKey="department" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="allocated" name="Allocated" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
              className="glass-panel rounded-xl2 p-5"
            >
              <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark mb-4">Maintenance Frequency</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={frequency.length > 0 ? frequency : [{ month: 'No data', requests: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="requests" name="Requests" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Lists row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
              className="glass-panel rounded-xl2 p-5"
            >
              <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
                <FiBox className="text-primary" /> Most Used Assets
              </h3>
              {mostUsed.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">No usage data available.</p>
              ) : (
                <div className="space-y-2">
                  {mostUsed.slice(0, 6).map((a, i) => (
                    <div key={a.id || i} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{a.name}</p>
                        {a.tag && <p className="text-xs text-slate-400 font-mono">{a.tag}</p>}
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-primary">{a.bookings || 0} bookings</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              className="glass-panel rounded-xl2 p-5"
            >
              <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
                <FiClock className="text-slate-400" /> Idle Assets
              </h3>
              {idle.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">No idle assets.</p>
              ) : (
                <div className="space-y-2">
                  {idle.slice(0, 6).map((a, i) => (
                    <div key={a.id || i} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{a.name}</p>
                        {a.tag && <p className="text-xs text-slate-400 font-mono">{a.tag}</p>}
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-amber-600">{a.status || 'idle'}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Maintenance due */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}
            className="glass-panel rounded-xl2 p-5 mb-6"
          >
            <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
              <FiTool className="text-amber-500" /> Assets Due for Maintenance
            </h3>
            {maintenanceDue.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">All assets are in good condition.</p>
            ) : (
              <div className="space-y-2">
                {maintenanceDue.slice(0, 8).map((a, i) => (
                  <div key={a.id || i} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <FiAlertTriangle className="shrink-0 text-amber-500 text-sm" />
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{a.name}</p>
                        {a.tag && <p className="text-xs text-slate-400 font-mono">{a.tag}</p>}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-amber-600">{a.condition === 'poor' ? 'service urgent' : 'service due soon'}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
