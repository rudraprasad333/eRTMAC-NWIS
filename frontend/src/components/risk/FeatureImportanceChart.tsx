import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface FeatureImportanceChartProps {
  contributingFactors: Record<string, number>;
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({
  contributingFactors
}) => {
  const data = Object.entries(contributingFactors).map(([name, val]) => ({
    name,
    weight: Math.round(val * 100)
  })).sort((a, b) => b.weight - a.weight);

  const colors = ['#EF4444', '#F59E0B', '#22B8CF', '#38BDF8', '#818CF8'];

  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            EXPLAINABLE AI — FEATURE IMPORTANCE ATTRIBUTION
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Relative SHAP-style feature contributions driving the current 82% stuck-pipe forecast
          </p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1C2A3A" horizontal={false} />
            <XAxis type="number" domain={[0, 50]} unit="%" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748B"
              tick={{ fontSize: 10, fill: '#CBD5E1' }}
              width={140}
            />
            <Tooltip
              formatter={(val: any) => [`${val}% Contribution`, 'Factor Weight']}
              contentStyle={{
                backgroundColor: '#0D1724',
                borderColor: '#1C2A3A',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontFamily: 'monospace',
                fontSize: '11px'
              }}
            />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
