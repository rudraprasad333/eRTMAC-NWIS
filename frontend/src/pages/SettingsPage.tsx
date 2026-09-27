import React, { useState } from 'react';
import { Sliders, Database, Server, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';
import { isBackendConnected } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [stuckThreshold, setStuckThreshold] = useState(70);
  const [torqueThreshold, setTorqueThreshold] = useState(22.0);
  const [radiusDefault, setRadiusDefault] = useState(25);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="petrol-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-cyan" />
            <h2 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wider">
              SYSTEM CONFIGURATION & INDUSTRIAL PARAMETERS
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            <span className="text-xs font-mono text-slate-300">
              {isBackendConnected ? 'Connected to FastAPI Backend (port 8000)' : 'Running Standalone Demo Engine'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Threshold Tuning */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-brand-sky uppercase tracking-wider block">
              1. DRILL-FLOOR ALERT THRESHOLDS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A] space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Stuck Pipe Alarm Cutoff:</span>
                  <span className="text-red-400 font-bold">{stuckThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={stuckThreshold}
                  onChange={(e) => setStuckThreshold(parseInt(e.target.value))}
                  className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A] space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Torque Hazard Level:</span>
                  <span className="text-amber-400 font-bold">{torqueThreshold} kft-lb</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="32"
                  step="0.5"
                  value={torqueThreshold}
                  onChange={(e) => setTorqueThreshold(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A] space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Default GIS Radius:</span>
                  <span className="text-brand-cyan font-bold">{radiusDefault} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={radiusDefault}
                  onChange={(e) => setRadiusDefault(parseInt(e.target.value))}
                  className="w-full accent-brand-cyan h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* System Diagnostics */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-bold text-brand-sky uppercase tracking-wider block">
              2. MACHINE LEARNING & KNOWLEDGE GRAPH STATUS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0A121D] p-3.5 rounded border border-[#1C2A3A] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>ML Risk Models:</span>
                  <span className="text-emerald-400 font-bold">5 Models Loaded (RF / GBDT)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Synthetic Basin Wells:</span>
                  <span className="text-slate-100 font-bold">30 Offset Wells Indexed</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Telemetry Points:</span>
                  <span className="text-slate-100 font-bold">2,480 Parameter Records</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>RAG Vector Corpus:</span>
                  <span className="text-emerald-400 font-bold">5 Reports & Studies Parsed</span>
                </div>
              </div>

              <div className="bg-[#0A121D] p-3.5 rounded border border-[#1C2A3A] space-y-2 text-xs font-sans text-slate-300">
                <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SAFETY & COMPLIANCE STANDARD</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  eRTMAC-NWIS is engineered strictly as an advisory decision-support system. All outputs are probabilistic estimates derived from historical offset wells.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1C2A3A]">
            {saved ? (
              <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Parameters successfully synchronized!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-brand-blue hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-md"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
