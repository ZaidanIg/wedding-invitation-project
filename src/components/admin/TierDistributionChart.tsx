'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TierData {
  tier: string;
  count: number;
  percentage: number;
}

interface TierDistributionChartProps {
  data: TierData[];
}

const TIER_COLORS: Record<string, string> = {
  DRAFT: '#94a3b8',
  BASIC: '#3b82f6',
  PREMIUM: '#f43f5e',
  ULTIMATE: '#f59e0b',
};

const TIER_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  BASIC: 'Basic',
  PREMIUM: 'Premium',
  ULTIMATE: 'Ultimate',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as { tier: string; count: number; percentage: number };
    return (
      <div className="bg-white border border-[#eceae4] rounded-2xl px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-[#6b6b6b] mb-1">{TIER_LABELS[d.tier] ?? d.tier}</p>
        <p className="text-sm font-bold text-[#1c1c1c]">{d.count} undangan</p>
        <p className="text-xs font-semibold text-[#6b6b6b]">{d.percentage}%</p>
      </div>
    );
  }
  return null;
};

interface LegendPayloadItem {
  value: string;
  color: string;
}

const CustomLegend = ({ payload }: { payload?: LegendPayloadItem[] }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-2">
    {(payload ?? []).map((entry) => (
      <span key={entry.value} className="flex items-center gap-1.5 text-xs font-bold text-[#6b6b6b]">
        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
        {TIER_LABELS[entry.value] ?? entry.value}
      </span>
    ))}
  </div>
);

export default function TierDistributionChart({ data }: TierDistributionChartProps) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-[#6b6b6b] font-semibold">
        Belum ada data undangan.
      </div>
    );
  }

  const filtered = data.filter((d) => d.count > 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="count"
          nameKey="tier"
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
        >
          {filtered.map((entry) => (
            <Cell
              key={entry.tier}
              fill={TIER_COLORS[entry.tier] ?? '#94a3b8'}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
