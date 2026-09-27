import React from 'react';
import { RiskSeverity } from '../../types';

interface RiskBadgeProps {
  severity: RiskSeverity | string;
  probability?: number;
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  probability,
  className = '',
}) => {
  const norm = (severity || 'LOW').toUpperCase();

  const getStyle = () => {
    switch (norm) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM_HIGH':
      case 'MEDIUM':
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'LOW':
      case 'SAFE':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase border ${getStyle()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        norm === 'CRITICAL' ? 'bg-red-400 animate-ping' :
        norm === 'HIGH' ? 'bg-orange-400' :
        norm.includes('MED') || norm === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
      }`} />
      <span>{norm.replace('_', ' ')}</span>
      {probability !== undefined && (
        <span className="ml-1 opacity-80">({Math.round(probability * 100)}%)</span>
      )}
    </span>
  );
};
