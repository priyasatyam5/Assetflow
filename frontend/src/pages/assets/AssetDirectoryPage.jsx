import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBox,
  FiPlus,
  FiX,
  FiPackage,
  FiTag,
  FiHash,
  FiDollarSign,
  FiCalendar,
  FiServer,
  FiTool,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiSearch,
} from 'react-icons/fi';
import {
  fetchAssets,
  fetchCategories,
  fetchVendors,
  fetchLocations,
  createAsset,
} from '../../services/assetService.js';
import Toast from '../../components/common/Toast.jsx';

const statusColors = {
  available: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200',
  allocated: 'bg-primary/10 text-primary border-primary/20 dark:border-primary-800',
  maintenance: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200',
  retired: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200',
};

export default function AssetDirectoryPage() {
  // ---- data ----
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ---- form ----
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    assetTag: '',
    serialNumber: '',
    categoryId: '',
    vendorId: '',
    locationId: '',
    acquisitionDate: '',
    acquisitionCost: '',
    condition: 'good',
    status: 'available',
    isSharedBookable: false,
    requiresBookingApproval: false,
  });

  // ---- toasts ----
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type: type || 'success' }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- fetch all on mount ----
  useEffect(() => {
    let c = false;
    setLoading(true);
    Promise.all([
      fetchAssets().catch(() => []),
      fetchCategories().catch(() => []),
      fetchVendors().catch(() => []),
      fetchLocations().catch(() => []),
    ]).then(([a, cat, ven, loc]) => {
      if (c) return;
      setAssets(a);
      setCategories(cat);
      setVendors(ven);
      setLocations(loc);
    }).finally(() => { if (!c) setLoading(false); });
    return () => { c = true; };
  }, []);

  // ---- submit handler ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { addToast('Asset name is required.', 'error'); return; }
    setSubmitting(true);
    try {
      const created = await createAsset({
        ...form,
        acquisitionCost: form.acquisitionCost ? parseFloat(form.acquisitionCost) : null,
        acquisitionDate: form.acquisitionDate || null,
      });
      addToast(`Asset "${created.name || form.name}" registered successfully!`, 'success');
      setShowForm(false);
      setForm({
        name: '', assetTag: '', serialNumber: '', categoryId: '', vendorId: '',
        locationId: '', acquisitionDate: '', acquisitionCost: '', condition: 'good',
        status: 'available', isSharedBookable: false, requiresBookingApproval: false,
      });
      // refresh list
      const refreshed = await fetchAssets().catch(() => []);
      setAssets(refreshed);
    } catch (err) {
      addToast(err?.response?.data?.error || 'Failed to register asset.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assets.filter((a) =>
    !searchTerm ||
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.assetTag || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      {/* toasts */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => <Toast key={t.id} {...t} onClose={dismissToast} />)}
        </AnimatePresence>
      </div>

      {/* header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <FiBox className="text-primary" /> Asset Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View, search, and register new assets.
          </p>
        </div>
        <button onClick={() => setShowForm((o) => !o)}
          className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Register Asset</>}
        </button>
      </motion.div>

      {/* registration form */}
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -12, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -12, height: 0 }} transition={{ duration: 0.3 }}
            className="glass-panel rounded-xl2 p-5 mb-6 overflow-hidden"
          >
            <h2 className="font-display text-base font-semibold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
              <FiPlus className="text-primary" /> Register New Asset
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Asset Name <span className="text-danger">*</span></label>
                <div className="relative">
                  <FiPackage className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-field pl-9" placeholder="e.g. Dell Latitude 5440" />
                </div>
              </div>

              {/* asset tag */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Asset Tag</label>
                <div className="relative">
                  <FiTag className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <input value={form.assetTag} onChange={(e) => setForm((f) => ({ ...f, assetTag: e.target.value }))}
                    className="input-field pl-9" placeholder="e.g. AF-0123" />
                </div>
              </div>

              {/* serial number */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Serial Number</label>
                <div className="relative">
                  <FiHash className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <input value={form.serialNumber} onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
                    className="input-field pl-9" placeholder="e.g. SN-123456" />
                </div>
              </div>

              {/* category */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Category</label>
                <div className="relative">
                  <FiServer className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="input-field pl-9">
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* vendor */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Vendor</label>
                <select value={form.vendorId} onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value }))}
                  className="input-field">
                  <option value="">Select vendor...</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              {/* location */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Location</label>
                <div className="relative">
                  <FiMapPin className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <select value={form.locationId} onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}
                    className="input-field pl-9">
                    <option value="">Select location...</option>
                    {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>

              {/* acquisition date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Acquisition Date</label>
                <div className="relative">
                  <FiCalendar className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <input type="date" value={form.acquisitionDate} onChange={(e) => setForm((f) => ({ ...f, acquisitionDate: e.target.value }))}
                    className="input-field pl-9" />
                </div>
              </div>

              {/* acquisition cost */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Acquisition Cost ($)</label>
                <div className="relative">
                  <FiDollarSign className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <input type="number" step="0.01" min="0" value={form.acquisitionCost}
                    onChange={(e) => setForm((f) => ({ ...f, acquisitionCost: e.target.value }))}
                    className="input-field pl-9" placeholder="0.00" />
                </div>
              </div>

              {/* condition */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Condition</label>
                <div className="relative">
                  <FiTool className="pointer-events-none absolute left-3 top-3 text-slate-400 text-sm" />
                  <select value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                    className="input-field pl-9">
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* checkboxes */}
            <div className="mt-4 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.isSharedBookable} onChange={(e) => setForm((f) => ({ ...f, isSharedBookable: e.target.checked }))}
                  className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                Shared / Bookable
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.requiresBookingApproval} onChange={(e) => setForm((f) => ({ ...f, requiresBookingApproval: e.target.checked }))}
                  className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                Requires Booking Approval
              </label>
            </div>

            <button type="submit" disabled={submitting || !form.name}
              className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <><FiRefreshCw className="animate-spin" /> Registering...</> : <><FiCheckCircle /> Register Asset</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* search + table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
        className="glass-panel rounded-xl2 p-5"
      >
        {/* search bar */}
        <div className="relative mb-4 max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or tag..." className="input-field pl-9" />
        </div>

        {/* table */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
            <FiRefreshCw className="animate-spin" /> Loading assets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <FiBox className="mx-auto text-3xl text-slate-300 mb-3" />
            <p className="text-slate-500">{searchTerm ? 'No matching assets found.' : 'No assets registered yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 first:pl-0">Asset</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Vendor</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Location</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Condition</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr key={a.id || i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-3 py-3 first:pl-0">
                      <p className="font-medium text-ink dark:text-ink-dark">{a.name || 'Untitled'}</p>
                      {a.assetTag && <p className="text-xs font-mono text-slate-400">{a.assetTag}</p>}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{a.category?.name || '-'}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{a.vendor?.name || '-'}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{a.location?.name || '-'}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        a.condition === 'poor' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-200' :
                        a.condition === 'fair' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200' :
                        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200'
                      }`}>
                        {a.condition || 'good'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[a.status] || statusColors.available}`}>
                        {a.condition === 'poor' && <FiAlertTriangle className="mr-1 text-xs" />}
                        {a.status === 'available' && <FiCheckCircle className="mr-1 text-xs" />}
                        {a.status || 'available'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
