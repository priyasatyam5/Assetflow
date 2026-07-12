import { motion } from 'framer-motion';

/**
 * Table
 * Lightweight, responsive table with row hover and fade-in animation.
 * Columns: [{ key, label, render? }]
 * Data: array of objects
 */
export default function Table({ columns = [], data = [] }) {
  if (!columns.length || !data.length) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        No data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 first:pl-0 last:pr-0"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row.id || i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-3 py-3 text-slate-700 dark:text-slate-300 first:pl-0 last:pr-0 whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
