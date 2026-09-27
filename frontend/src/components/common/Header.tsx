import React from 'react';
import { 
  Play, 
  Layers, 
  Bell, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { isBackendConnected } from '../../services/api';

interface HeaderProps {
  activeWellId: string;
  onSelectWell: (wellId: string) => void;
  currentDepth: number;
  onRunDemo: () => void;
  unreadAlertCount: number;
  onNavigateAlerts: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeWellId,
  currentDepth,
  onRunDemo,
  unreadAlertCount,
  onNavigateAlerts,
  isSimulating
}) => {
  return (
    <header className="h-16 bg-[#0D1724]/95 border-b border-[#1C2A3A] px-5 flex items-center justify-between z-20 backdrop-blur-md sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-[#2F80ED] to-[#22B8CF] flex items-center justify-center shadow-[0_0_12px_rgba(47,128,237,0.4)]">
            <span className="font-mono text-sm font-black text-navy-950 tracking-tighter">NW</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-base tracking-wider text-slate-100">
                eRTMAC<span className="text-brand-cyan ml-0.5">·NWIS</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-blue/20 text-brand-sky border border-brand-blue/30 font-semibold">
                v1.0-PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans tracking-tight hidden sm:block">
              Nearby Wells Intelligence & Decision Support
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-[#1C2A3A] hidden md:block mx-1" />

        {/* Active Well Status Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded bg-[#101C2C] border border-[#1C2A3A]">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Compass className="w-3.5 h-3.5 text-brand-cyan" />
            <span>ACTIVE WELL:</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-100 text-brand-sky">
            {activeWellId}
          </span>
          <div className="h-3.5 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400">DEPTH:</span>
            <span className="font-bold text-amber-400">{currentDepth.toLocaleString()} m</span>
          </div>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">
              DRILLING (28.5° DEV)
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Simulation indicator */}
        {isSimulating && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono animate-pulse">
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LIVE SIMULATION ACTIVE</span>
          </div>
        )}

        {/* ONE-CLICK DEMO BUTTON */}
        <button
          onClick={onRunDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(34,184,207,0.3)] hover:shadow-[0_0_20px_rgba(34,184,207,0.5)] active:scale-95"
          title="Run 10-Step Interactive Demo Walkthrough"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>RUN DEMO</span>
        </button>

        {/* Alerts Button */}
        <button
          onClick={onNavigateAlerts}
          className="relative p-2 rounded bg-[#101C2C] hover:bg-[#16253B] border border-[#1C2A3A] text-slate-300 hover:text-white transition-colors"
          title="Drilling Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-bounce">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Backend Connectivity Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101C2C] border border-[#1C2A3A] text-[11px] font-mono text-slate-400">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-cyan-400'}`} />
          <span>{isBackendConnected ? 'API SYNCED' : 'DEMO MODE'}</span>
        </div>
      </div>
    </header>
  );
};
