import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ASSET_DISTRIBUTION } from '../../../utils/mockData.js';

/**
 * AssetDistributionChart
 * Donut chart showing the breakdown of assets by category.
 */
export default function AssetDistributionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel rounded-xl2 p-5"
    >
      <h3 className="mb-4 font-display text-sm font-semibold text-ink dark:text-ink-dark">
        Asset Distribution
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={ASSET_DISTRIBUTION}
            cx="50%"
            cy="50%"
            innerRadius={54}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {ASSET_DISTRIBUTION.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              fontSize: 13,
              fontWeight: 500,
            }}
            formatter={(value, name) => [value.toLocaleString(), name]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {ASSET_DISTRIBUTION.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
