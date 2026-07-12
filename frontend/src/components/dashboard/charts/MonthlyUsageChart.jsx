import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MONTHLY_USAGE } from '../../../utils/mockData.js';

/**
 * MonthlyUsageChart
 * Grouped bar chart comparing allocations vs returns per month.
 */
export default function MonthlyUsageChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel rounded-xl2 p-5"
    >
      <h3 className="mb-4 font-display text-sm font-semibold text-ink dark:text-ink-dark">
        Monthly Usage
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MONTHLY_USAGE} barGap={4} barSize={18}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              fontSize: 13,
              fontWeight: 500,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="allocated"
            name="Allocated"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="returned"
            name="Returned"
            fill="#14B8A6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
