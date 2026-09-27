import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'critical';
  subtitle?: string;
  statusBorder?: 'normal' | 'warning' | 'critical' | 'cyan';
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendType = 'neutral',
  subtitle,
  statusBorder = 'normal',
  className = ''
}) => {
  const borderClasses = {
    normal: 'border-[#1C2A3A] hover:border-brand-blue/50',
    cyan: 'border-brand-cyan/40 bg-gradient-to-b from-[#0D1724] to-[#102236]',
    warning: 'border-amber-500/40 bg-gradient-to-b from-[#0D1724] to-[#241B0D]',
    critical: 'border-red-500/50 bg-gradient-to-b from-[#0D1724] to-[#260D12]'
  }[statusBorder];

  const trendColor = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-slate-400',
    critical: 'text-red-400 font-bold'
  }[trendType];

  return (
    <div className={`petrol-card p-4 transition-all duration-200 ${borderClasses} ${className}`}>
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="text-xs font-mono tracking-wider uppercase">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-brand-cyan/80" />}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono text-slate-100 tracking-tight">{value}</span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {(trend || subtitle) && (
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-[#1C2A3A]/60">
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          {trend && <span className={trendColor}>{trend}</span>}
        </div>
      )}
    </div>
  );
};
