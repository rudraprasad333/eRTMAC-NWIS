import React, { useState } from 'react';
import { AlertItem } from '../types';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Info, Check } from 'lucide-react';
import { api } from '../services/api';

interface AlertsPageProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onAcknowledgeAlert
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="petrol-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1C2A3A]">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h2 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wider">
                PROACTIVE DRILLING HAZARD ALERTS CONSOLE
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Live automated threshold breaches, offset problem zone proximities, and formation transition advisories
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0A121D] p-1 rounded border border-[#1C2A3A]">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  filter === lvl
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'CRITICAL';
          const isWarn = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-md border transition-all ${
                alert.acknowledged
                  ? 'bg-[#0A121D]/70 border-[#1C2A3A] opacity-75'
                  : isCrit
                  ? 'bg-red-500/15 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                  : isWarn
                  ? 'bg-amber-500/15 border-amber-500/50'
                  : 'bg-[#0D1724] border-[#1C2A3A]'
              }`}
            >
              <div className="flex items-start justify-between pb-2 border-b border-[#1C2A3A]/60">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    isCrit ? 'bg-red-500/30 text-red-400' : isWarn ? 'bg-amber-500/30 text-amber-400' : 'bg-cyan-500/30 text-brand-cyan'
                  }`}>
                    {isCrit ? <ShieldAlert className="w-4 h-4 animate-pulse" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded mr-2 ${
                      isCrit ? 'bg-red-500 text-white' : isWarn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-cyan-500 text-slate-950 font-bold'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-100">
                      {alert.title}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-slate-400">
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <div className="py-3 space-y-2 text-xs font-sans text-slate-300 leading-relaxed">
                <p>{alert.message}</p>
                <div className="bg-[#07111F] p-2.5 rounded border border-[#1C2A3A] text-xs font-mono text-emerald-400">
                  <strong className="text-slate-300">Mandatory Action: </strong>
                  {alert.action_suggestion}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-[#1C2A3A]/40">
                <span>Target: <strong>{alert.well_id} @ {alert.depth} m</strong> ({alert.risk_zone})</span>
                
                {alert.acknowledged ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    ACKNOWLEDGED BY DRILLER
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3 py-1 rounded bg-[#16253B] hover:bg-[#1E334F] text-slate-200 border border-[#1C2A3A] hover:border-emerald-500/50 hover:text-emerald-400 transition-colors font-bold"
                  >
                    Acknowledge Alert
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
