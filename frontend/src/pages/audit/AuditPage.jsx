import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiSend,
} from 'react-icons/fi';
import { fetchActiveAuditCycle, closeAuditCycle } from '../../services/auditService.js';
import Toast from '../../components/common/Toast.jsx';

const verificationStyles = {
  Verified: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Missing: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  Damaged: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Pending: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchActiveAuditCycle()
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setData({ active: false, cycle: null }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCloseCycle = async () => {
    if (!data?.cycle?.id) return;
    setClosing(true);
    try {
      await closeAuditCycle(data.cycle.id);
      addToast('Audit cycle closed successfully!', 'success');
      setData((prev) => ({ ...prev, cycle: { ...prev.cycle, status: 'closed' } }));
    } catch (err) {
      addToast(err?.response?.data?.error || 'Failed to close cycle.', 'error');
    } finally {
      setClosing(false);
    }
  };

  const cycle = data?.cycle;
  const assets = cycle?.assets?.filter((a) => a) || [];
  const flaggedCount = assets.filter((a) => a.verification === 'Missing' || a.verification === 'Damaged').length;

  return (
    <div className="max-w-6xl">
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
        {toasts.map((t) => <Toast key={t.id} {...t} onClose={dismissToast} />)}
      </div>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
          <FiShield className="text-primary" /> Audit
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage audit cycles and verify asset locations.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-12 justify-center">
          <FiRefreshCw className="animate-spin" /> Loading audit data...
        </div>
      ) : !cycle ? (
        <div className="glass-panel rounded-xl2 p-8 text-center">
          <FiShield className="mx-auto text-3xl text-slate-300 mb-3" />
          <p className="text-slate-500">No active audit cycle found.</p>
        </div>
      ) : (
        <>
          {/* Header summary */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
            className="glass-panel rounded-xl2 p-5 mb-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">{cycle.name}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {cycle.department && (
                    <span className="flex items-center gap-1.5">
                      <FiUser className="text-slate-400" /> {cycle.department.name}
                    </span>
                  )}
                  {cycle.startDate && (
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="text-slate-400" />
                      {new Date(cycle.startDate).toLocaleDateString()} – {cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : 'Ongoing'}
                    </span>
                  )}
                  {cycle.auditors?.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <FiUser className="text-slate-400" /> Auditors: {cycle.auditors.join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                cycle.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200' :
                'bg-slate-100 text-slate-500 border-slate-200'
              }`}>{cycle.status}</span>
            </div>
          </motion.div>

          {/* Asset checklist table */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-panel rounded-xl2 p-5 mb-6"
          >
            <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark mb-4">Asset Checklist</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 first:pl-0">Asset</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Expected Location</th>
                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length === 0 ? (
                    <tr><td colSpan={3} className="py-6 text-center text-slate-400">No assets in this audit cycle.</td></tr>
                  ) : assets.map((a, i) => (
                    <motion.tr key={a.id || i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <td className="px-3 py-3 first:pl-0">
                        <span className="font-medium text-ink dark:text-ink-dark">{a.assetName || 'Unknown'}</span>
                        {a.assetTag && <span className="ml-2 font-mono text-xs text-slate-400">{a.assetTag}</span>}
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{a.expectedLocation || 'Unassigned'}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${verificationStyles[a.verification] || verificationStyles.Pending}`}>
                          {a.verification === 'Verified' && <FiCheckCircle className="mr-1 text-xs" />}
                          {a.verification === 'Missing' && <FiXCircle className="mr-1 text-xs" />}
                          {a.verification === 'Damaged' && <FiAlertTriangle className="mr-1 text-xs" />}
                          {a.verification || 'Pending'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Discrepancy banner */}
          {flaggedCount > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
              className="rounded-xl2 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-500/10 p-4 mb-6 flex items-start gap-3"
            >
              <FiAlertTriangle className="mt-0.5 shrink-0 text-amber-500 text-lg" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-300">Discrepancy Report</p>
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                  {flaggedCount} asset{flaggedCount > 1 ? 's' : ''} flagged — discrepancy report generated automatically.
                </p>
              </div>
            </motion.div>
          )}

          {/* Close cycle button */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <button onClick={handleCloseCycle} disabled={closing || cycle.status !== 'active'}
              className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {closing ? <><FiRefreshCw className="animate-spin" /> Closing...</> : <><FiSend /> Close Audit Cycle</>}
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}
