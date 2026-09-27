import React from 'react';
import { Well, DrillingParam } from '../../types';
import { Compass, Gauge, Thermometer, Wind, Activity, ArrowDownRight } from 'lucide-react';

interface ActiveWellCardProps {
  well: Well;
  currentDepth: number;
  liveParam?: {
    rop: number;
    torque: number;
    wob: number;
    rpm: number;
    mud_weight: number;
    standpipe_pressure: number;
  };
}

export const ActiveWellCard: React.FC<ActiveWellCardProps> = ({
  well,
  currentDepth,
  liveParam = {
    rop: 14.2,
    torque: 24.8,
    wob: 18.5,
    rpm: 110.0,
    mud_weight: 10.8,
    standpipe_pressure: 3450.0
  }
}) => {
  const progressPercent = Math.min(100, Math.round((currentDepth / well.total_depth) * 100));

  return (
    <div className="petrol-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-[#1C2A3A]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-base font-bold text-slate-100">{well.well_id}</h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
              ACTIVE OPERATION
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {well.field_name} • {well.trajectory_type} {well.well_type}
          </p>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs text-slate-400 block">TOTAL DEPTH</span>
          <span className="text-sm font-bold text-brand-sky">{well.total_depth.toLocaleString()} m</span>
        </div>
      </div>

      {/* Depth Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">DRILLING PROGRESS:</span>
          <span className="font-bold text-slate-200">{currentDepth} m / {well.total_depth} m ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Operational Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">ROP</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold font-mono text-slate-100">{liveParam.rop}</span>
            <span className="text-[10px] font-mono text-slate-400">m/h</span>
          </div>
        </div>

        <div className="bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">TORQUE</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold font-mono text-amber-400">{liveParam.torque}</span>
            <span className="text-[10px] font-mono text-slate-400">kft-lb</span>
          </div>
        </div>

        <div className="bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">MUD WT</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold font-mono text-cyan-400">{liveParam.mud_weight}</span>
            <span className="text-[10px] font-mono text-slate-400">ppg</span>
          </div>
        </div>

        <div className="bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">WOB</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold font-mono text-slate-100">{liveParam.wob}</span>
            <span className="text-[10px] font-mono text-slate-400">klbs</span>
          </div>
        </div>

        <div className="bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">RPM</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold font-mono text-slate-100">{liveParam.rpm}</span>
            <span className="text-[10px] font-mono text-slate-400">rpm</span>
          </div>
        </div>

        <div className="bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">SPP</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-bold font-mono text-slate-100">{liveParam.standpipe_pressure}</span>
            <span className="text-[10px] font-mono text-slate-400">psi</span>
          </div>
        </div>
      </div>

      {/* Target Formation Details */}
      <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-300">Target Formation:</span>
        </div>
        <span className="font-bold text-brand-sky">{well.formation}</span>
      </div>
    </div>
  );
};
