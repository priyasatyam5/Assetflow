import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiUser,
  FiCalendar,
  FiArrowRight,
  FiSend,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  fetchAllocationStatus,
  fetchAllocationHistory,
  createAllocation,
  submitTransferRequest,
} from '../../services/allocationService.js';
import Toast from '../../components/common/Toast.jsx';

// ---------- mock data helpers ----------
const ASSETS = [
  { id: 'asset-1', name: 'Dell Latitude 5440', tag: 'AF-0114' },
  { id: 'asset-2', name: 'Dell Monitor 27"', tag: 'AF-0201' },
  { id: 'asset-3', name: 'Epson Projector', tag: 'AF-0062' },
  { id: 'asset-4', name: 'MacBook Pro 16"', tag: 'AF-0330' },
  { id: 'asset-5', name: 'Ergonomic Office Chair', tag: 'AF-0202' },
];

const EMPLOYEES = [
  { id: 'emp-1', name: 'Priya Shah', department: 'Engineering' },
  { id: 'emp-2', name: 'Raj Patel', department: 'Engineering' },
  { id: 'emp-3', name: 'Kiran Joshi', department: 'Facilities' },
  { id: 'emp-4', name: 'Sana Iqbal', department: 'HR' },
  { id: 'emp-5', name: 'Aditi Rao', department: 'IT' },
];
// ------------------------------------------

export default function AssetAllocationPage() {
  // ----- Form state -----
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // ----- Transfer state -----
  const [transferToEmployeeId, setTransferToEmployeeId] = useState('');
  const [transferReason, setTransferReason] = useState('');

  // ----- Data state -----
  const [allocationStatus, setAllocationStatus] = useState(null);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ----- Toasts -----
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type: type || 'success' }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ----- When asset changes, fetch status + history -----
  useEffect(() => {
    if (!selectedAssetId) {
      setAllocationStatus(null);
      setAllocationHistory([]);
      setTransferToEmployeeId('');
      setTransferReason('');
      return;
    }

    let cancelled = false;

    setLoadingStatus(true);
    setLoadingHistory(true);

    fetchAllocationStatus(selectedAssetId)
      .then((data) => {
        if (!cancelled) setAllocationStatus(data);
      })
      .catch(() => {
        if (!cancelled) {
          setAllocationStatus({ allocated: false, allocation: null });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingStatus(false);
      });

    fetchAllocationHistory(selectedAssetId)
      .then((data) => {
        if (!cancelled) setAllocationHistory(data);
      })
      .catch(() => {
        if (!cancelled) setAllocationHistory([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedAssetId]);

  const resetForm = useCallback(() => {
    setEmployeeId('');
    setDepartment('');
    setReturnDate('');
    setTransferToEmployeeId('');
    setTransferReason('');
  }, []);

  // ----- Allocate handler -----
  const handleAllocate = async () => {
    if (!selectedAssetId || !employeeId) {
      addToast('Please select an asset and employee.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await createAllocation({
        assetId: selectedAssetId,
        employeeId,
        departmentId: department || undefined,
        returnDate: returnDate || undefined,
      });
      addToast('Asset allocated successfully!', 'success');
      resetForm();
      const [status, history] = await Promise.all([
        fetchAllocationStatus(selectedAssetId),
        fetchAllocationHistory(selectedAssetId),
      ]);
      setAllocationStatus(status);
      setAllocationHistory(history);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to allocate asset.';
      addToast(msg, 'error');
      if (err?.response?.status === 409 && err?.response?.data) {
        setAllocationStatus({
          allocated: true,
          allocation: {
            asset: { id: selectedAssetId },
            employee: { name: err.response.data.currentHolder?.employeeName || 'Unknown' },
            department: { name: err.response.data.currentHolder?.departmentName || 'Unknown' },
            allocatedAt: err.response.data.currentHolder?.allocationDate,
          },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ----- Transfer handler -----
  const handleTransfer = async () => {
    if (!selectedAssetId || !transferToEmployeeId) {
      addToast('Please select a target employee.', 'error');
      return;
    }
    if (!allocationStatus?.allocation?.id) {
      addToast('No active allocation found for this asset.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitTransferRequest({
        assetId: selectedAssetId,
        currentAllocationId: allocationStatus.allocation.id,
        toEmployeeId: transferToEmployeeId,
        reason: transferReason,
      });
      addToast('Transfer request submitted successfully!', 'success');
      setTransferToEmployeeId('');
      setTransferReason('');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to submit transfer request.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isAllocated = allocationStatus?.allocated === true;
  const currentHolder = allocationStatus?.allocation;

  return (
    <div className="max-w-5xl">
      {/* Toasts */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={dismissToast} />
          ))}
        </AnimatePresence>
      </div>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
          Allocation and Transfer
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Allocate assets to employees or submit transfer requests.
        </p>
      </motion.div>

      {/* Asset selector */}
      <div className="glass-panel rounded-xl2 p-5 mb-6">
        <label className="mb-2 block text-sm font-semibold text-ink dark:text-ink-dark">
          Select Asset
        </label>
        <div className="relative max-w-md">
          <FiPackage className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <select
            value={selectedAssetId}
            onChange={(e) => {
              setSelectedAssetId(e.target.value);
              resetForm();
            }}
            className="input-field pl-10"
          >
            <option value="">Choose an asset...</option>
            {ASSETS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.tag} - {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conflict banner */}
      <AnimatePresence>
        {selectedAssetId && isAllocated && (
          <motion.div
            key="conflict-banner"
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl2 border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-500/10 p-4 mb-6 overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="mt-0.5 shrink-0 text-rose-500 text-lg" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-300">
                  Already Allocated
                </p>
                <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
                  <strong>{currentHolder?.employee?.name || 'Unknown'}</strong> (
                  {currentHolder?.department?.name || 'Unknown department'}
                  ) - Direct re-allocation is blocked. Submit a transfer request below.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {selectedAssetId && loadingStatus && (
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <FiRefreshCw className="animate-spin" />
          Checking allocation status...
        </div>
      )}

      {/* Main form area */}
      <AnimatePresence mode="wait">
        {selectedAssetId && !loadingStatus && (
          <motion.div
            key={isAllocated ? 'transfer-form' : 'allocate-form'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {isAllocated ? (
              /* Transfer Request form */
              <div className="glass-panel rounded-xl2 p-5 mb-6">
                <h2 className="font-display text-base font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
                  <FiSend className="text-accent" />
                  Transfer Request
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Current Holder
                    </label>
                    <div className="input-field flex items-center gap-2 text-ink dark:text-ink-dark cursor-not-allowed opacity-70">
                      <FiUser className="text-slate-400" />
                      <span>
                        {currentHolder?.employee?.name || 'Unknown'}
                        {currentHolder?.department?.name ? ' (' + currentHolder.department.name + ')' : ''}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Transfer To <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <select
                        value={transferToEmployeeId}
                        onChange={(e) => setTransferToEmployeeId(e.target.value)}
                        className="input-field pl-10"
                      >
                        <option value="">Select employee...</option>
                        {EMPLOYEES.filter(
                          (e) => e.id !== currentHolder?.employee?.id
                        ).map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} - {e.department}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Reason for Transfer
                    </label>
                    <textarea
                      rows={3}
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      className="input-field resize-none"
                      placeholder="e.g. Role change, department relocation, asset rebalancing..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={submitting || !transferToEmployeeId}
                  className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Submit Transfer Request
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Allocate Asset form */
              <div className="glass-panel rounded-xl2 p-5 mb-6">
                <h2 className="font-display text-base font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
                  <FiArrowRight className="text-primary" />
                  Allocate Asset
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Employee <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="input-field pl-10"
                      >
                        <option value="">Select employee...</option>
                        {EMPLOYEES.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} - {e.department}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select department...</option>
                      <option value="Engineering">Engineering</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Facilities">Facilities</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Expected Return Date
                    </label>
                    <div className="relative">
                      <FiCalendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAllocate}
                  disabled={submitting || !employeeId}
                  className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Allocating...
                    </>
                  ) : (
                    <>
                      <FiArrowRight />
                      Allocate Asset
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allocation History */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-panel rounded-xl2 p-5"
      >
        <h2 className="font-display text-base font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
          <FiClock className="text-slate-400" />
          Allocation History
          {loadingHistory && <FiRefreshCw className="ml-1 animate-spin text-slate-400 text-xs" />}
        </h2>

        {!selectedAssetId ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Select an asset to view its allocation history.
          </p>
        ) : loadingHistory ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : allocationHistory.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No allocation history for this asset.
          </p>
        ) : (
          <div className="space-y-3">
            {allocationHistory.map((entry, i) => (
              <motion.div
                key={entry.id || i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="flex items-start gap-3 rounded-xl border border-slate-200/70 dark:border-slate-700 p-3"
              >
                <span
                  className={
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ' +
                    (entry.action === 'Returned'
                      ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600'
                      : 'bg-primary/10 text-primary')
                  }
                >
                  {entry.action === 'Returned' ? (
                    <FiCheckCircle className="text-base" />
                  ) : (
                    <FiSend className="text-base" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">
                    <span className="font-semibold">{entry.action}</span> to{' '}
                    {entry.employeeName}
                    {entry.departmentName ? ' (' + entry.departmentName + ')' : ''}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {entry.date
                      ? new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Unknown date'}
                    {entry.returnCondition ? ' - condition: ' + entry.returnCondition : ''}
                    {entry.returnNotes ? ' - ' + entry.returnNotes : ''}
                    {entry.status !== 'Returned' ? ' - ' + entry.status : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
