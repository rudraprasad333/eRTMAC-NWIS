import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { DepthRiskItem } from '../../types';

interface DepthRiskChartProps {
  data: DepthRiskItem[];
  currentDepth: number;
}

export const DepthRiskChart: React.FC<DepthRiskChartProps> = ({
  data,
  currentDepth
}) => {
  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            CONTINUOUS DEPTH-WISE MULTI-RISK TRAJECTORY
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Depth-dependent probability curves across stratigraphy. Highlighted red band indicates the 2,700–2,800 m critical zone.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2.5 h-2.5 bg-red-500/30 border border-red-500 rounded-sm" />
            2,700–2,800m Hazard Zone
          </span>
          <span className="flex items-center gap-1 text-brand-cyan">
            <span className="w-2.5 h-2.5 bg-brand-cyan rounded-full" />
            Current Bit ({currentDepth}m)
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C2A3A" />
            
            <XAxis
              dataKey="depth"
              stroke="#64748B"
              unit="m"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              label={{ value: 'Measured Depth (meters MD)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
            />
            
            <YAxis
              domain={[0, 1.0]}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              stroke="#64748B"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              label={{ value: 'Predicted Risk Probability', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
            />

            <Tooltip
              formatter={(val: any, name: any) => [`${Math.round(Number(val) * 100)}%`, name]}
              labelFormatter={(depth) => `Measured Depth: ${depth} m MD`}
              contentStyle={{
                backgroundColor: '#0D1724',
                borderColor: '#1C2A3A',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontFamily: 'monospace',
                fontSize: '11px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />

            {/* Critical Interval Shaded Area (2,700m - 2,800m) */}
            <ReferenceArea
              x1={2700}
              x2={2800}
              stroke="rgba(239, 68, 68, 0.4)"
              strokeOpacity={0.5}
              fill="rgba(239, 68, 68, 0.15)"
            />

            {/* Current Bit Marker Line */}
            <ReferenceLine
              x={currentDepth}
              stroke="#00D2FF"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{ value: `Bit: ${currentDepth}m`, fill: '#00D2FF', fontSize: 10, position: 'top' }}
            />

            {/* Risk Curves */}
            <Line
              type="monotone"
              dataKey="stuck_pipe"
              name="Stuck Pipe Risk"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="lost_circulation"
              name="Lost Circulation Risk"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="high_torque"
              name="High Torque Hazard"
              stroke="#A855F7"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="kick"
              name="Gas Influx / Kick"
              stroke="#22C55E"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
