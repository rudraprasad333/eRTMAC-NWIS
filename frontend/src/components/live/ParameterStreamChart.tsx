import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export interface TelemetryPoint {
  time: string;
  depth: number;
  rop: number;
  torque: number;
  wob: number;
  rpm: number;
  mud_weight: number;
  standpipe_pressure: number;
}

interface ParameterStreamChartProps {
  data: TelemetryPoint[];
  selectedMetrics?: string[];
}

export const ParameterStreamChart: React.FC<ParameterStreamChartProps> = ({
  data
}) => {
  return (
    <div className="petrol-card p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#1C2A3A]">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            REAL-TIME TELEMETRY LOG STREAM
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Continuous surface & downhole MWD parameter tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-emerald-400 font-bold">1 Hz LIVE STREAM</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C2A3A" />
            <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis yAxisId="left" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748B" tick={{ fontSize: 10, fill: '#94A3B8' }} />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1724',
                borderColor: '#1C2A3A',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontFamily: 'monospace',
                fontSize: '11px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="torque"
              name="Torque (kft-lbs)"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="rop"
              name="ROP (m/hr)"
              stroke="#22B8CF"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="wob"
              name="WOB (klbs)"
              stroke="#38BDF8"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="standpipe_pressure"
              name="SPP (psi)"
              stroke="#A855F7"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
