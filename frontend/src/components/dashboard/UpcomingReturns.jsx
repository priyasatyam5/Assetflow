import Table from '../common/Table.jsx';
import Badge from '../common/Badge.jsx';
import { UPCOMING_RETURNS } from '../../utils/mockData.js';

/**
 * UpcomingReturns
 * Responsive table of assets due back soon, with status badges
 * (On Track / Due Today / Overdue).
 */
export default function UpcomingReturns() {
  const columns = [
    { key: 'id', label: 'Asset ID', render: (row) => <span className="font-mono text-xs text-slate-500">{row.id}</span> },
    { key: 'asset', label: 'Asset Name', render: (row) => <span className="font-medium">{row.asset}</span> },
    { key: 'employee', label: 'Employee' },
    { key: 'date', label: 'Return Date' },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
  ];

  return (
    <div className="glass-panel rounded-xl2 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark">
          Upcoming Returns
        </h3>
        <button className="text-xs font-medium text-primary hover:underline">View all</button>
      </div>
      <Table columns={columns} data={UPCOMING_RETURNS} />
    </div>
  );
}
