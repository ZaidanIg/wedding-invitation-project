'use client';

import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

function formatRupiah(value: number): string {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${value}`;
}

function formatDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (days <= 30) {
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  if (days <= 90) {
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#eceae4] rounded-2xl px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-[#6b6b6b] mb-1">{label}</p>
        <p className="text-base font-bold text-emerald-600">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  const days = data.length;

  // Determine tick interval to avoid crowding
  const tickInterval = days <= 7 ? 0 : days <= 30 ? 4 : days <= 90 ? 9 : 30;

  const formatted = data.map((d) => ({
    ...d,
    label: formatDate(d.date, days),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9b9b9b', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          tickFormatter={formatRupiah}
          tick={{ fontSize: 11, fill: '#9b9b9b', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#10b981', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
