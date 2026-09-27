import React from 'react';

interface LiveGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warningThreshold: number;
  criticalThreshold: number;
  color?: string;
}

export const LiveGauge: React.FC<LiveGaugeProps> = ({
  label,
  value,
  unit,
  min,
  max,
  warningThreshold,
  criticalThreshold,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const isCritical = value >= criticalThreshold;
  const isWarning = value >= warningThreshold && !isCritical;

  const strokeColor = isCritical ? '#EF4444' : (isWarning ? '#F59E0B' : '#22B8CF');

  // Semi-circle gauge calculation
  const radius = 42;
  const circumference = Math.PI * radius; // Half circle arc length
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`p-4 rounded-md border flex flex-col items-center justify-between relative bg-[#0D1724]/90 backdrop-blur-md transition-all ${
      isCritical ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
      isWarning ? 'border-amber-500/40' : 'border-[#1C2A3A]'
    }`}>
      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </span>

      {/* Circular Arc SVG */}
      <div className="relative w-28 h-16 flex items-end justify-center overflow-hidden">
        <svg className="w-28 h-28 transform -rotate-180" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1C2A3A"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset="0"
          />
          {/* Active Value Arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Center Digital Value */}
        <div className="absolute bottom-0 text-center font-mono">
          <span className={`text-xl font-black ${isCritical ? 'text-red-400' : (isWarning ? 'text-amber-400' : 'text-slate-100')}`}>
            {value}
          </span>
          <span className="text-[10px] text-slate-400 ml-1">{unit}</span>
        </div>
      </div>

      {/* Scale Bounds & Threshold Status */}
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 mt-2 pt-1 border-t border-[#1C2A3A]/40">
        <span>{min}</span>
        <span className={isCritical ? 'text-red-400 font-bold' : (isWarning ? 'text-amber-400 font-bold' : 'text-emerald-400')}>
          {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'NORMAL'}
        </span>
        <span>{max}</span>
      </div>
    </div>
  );
};
