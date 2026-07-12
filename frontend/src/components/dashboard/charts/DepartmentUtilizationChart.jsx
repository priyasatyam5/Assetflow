import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DEPARTMENT_UTILIZATION } from '../../../utils/mockData.js';

/**
 * DepartmentUtilizationChart
 * Stacked area chart showing utilization trends across departments.
 */
export default function DepartmentUtilizationChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-panel rounded-xl2 p-5"
    >
      <h3 className="mb-4 font-display text-sm font-semibold text-ink dark:text-ink-dark">
        Department Utilization
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DEPARTMENT_UTILIZATION}>
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
          <Area
            type="monotone"
            dataKey="engineering"
            name="Engineering"
            stackId="1"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="facilities"
            name="Facilities"
            stackId="1"
            stroke="#14B8A6"
            fill="#14B8A6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="fieldOps"
            name="Field Ops"
            stackId="1"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
