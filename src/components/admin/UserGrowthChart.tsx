'use client';

import { 
  BarChart,
  Bar,
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

interface UserGrowthChartProps {
  data: DataPoint[];
}

function formatDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (days <= 30) {
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#eceae4] rounded-2xl px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-[#6b6b6b] mb-1">{label}</p>
        <p className="text-base font-bold text-blue-600">
          +{payload[0].value} pengguna baru
        </p>
      </div>
    );
  }
  return null;
};

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const days = data.length;
  const tickInterval = days <= 7 ? 0 : days <= 30 ? 4 : days <= 90 ? 9 : 30;

  const formatted = data.map((d) => ({
    ...d,
    label: formatDate(d.date, days),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9b9b9b', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#9b9b9b', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
