import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sliders, 
  Activity,
  AlertTriangle,
  StepForward
} from 'lucide-react';

interface SimulationControllerProps {
  isRunning: boolean;
  onToggle: () => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  onStep: (delta: number) => void;
  onReset: (depth?: number) => void;
  currentDepth: number;
  torque: number;
  rop: number;
  mudWeight: number;
  onUpdateParam: (key: string, val: number) => void;
}

export const SimulationController: React.FC<SimulationControllerProps> = ({
  isRunning,
  onToggle,
  speed,
  onSetSpeed,
  onStep,
  onReset,
  currentDepth,
  torque,
  rop,
  mudWeight,
  onUpdateParam
}) => {
  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            DRILLING SIMULATION CONTROLS
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
          SYNTHETIC TELEMETRY ENGINE
        </span>
      </div>

      {/* Main Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs font-bold uppercase transition-all shadow-md ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'PAUSE DRILLING' : 'START SIMULATION'}</span>
          </button>

          <button
            onClick={() => onStep(2.5)}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#16253B] hover:bg-[#1E334F] text-slate-200 font-mono text-xs font-semibold border border-[#1C2A3A] transition-colors"
            title="Drill Ahead +2.5m"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>+2.5m Step</span>
          </button>

          <button
            onClick={() => onReset(2715)}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#16253B] hover:bg-[#1E334F] text-slate-200 font-mono text-xs font-semibold border border-[#1C2A3A] transition-colors"
            title="Reset to 2,715m critical interval"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (2,715m)</span>
          </button>
        </div>

        {/* Speed Multipliers */}
        <div className="flex items-center gap-1 bg-[#101C2C] p-1 rounded border border-[#1C2A3A]">
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                speed === s
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Manual Parameter Override Sliders */}
      <div className="space-y-3 pt-1">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          LIVE PARAMETER TUNING / TEST-BED:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Torque Slider */}
          <div className="space-y-1 bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Torque:</span>
              <span className="text-amber-400 font-bold">{torque} kft-lb</span>
            </div>
            <input
              type="range"
              min="8"
              max="36"
              step="0.5"
              value={torque}
              onChange={(e) => onUpdateParam('torque', parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* ROP Slider */}
          <div className="space-y-1 bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">ROP:</span>
              <span className="text-cyan-400 font-bold">{rop} m/hr</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="0.5"
              value={rop}
              onChange={(e) => onUpdateParam('rop', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mud Weight Slider */}
          <div className="space-y-1 bg-[#09121E] p-2.5 rounded border border-[#1C2A3A]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Mud Weight:</span>
              <span className="text-blue-400 font-bold">{mudWeight} ppg</span>
            </div>
            <input
              type="range"
              min="9.0"
              max="12.5"
              step="0.1"
              value={mudWeight}
              onChange={(e) => onUpdateParam('mud_weight', parseFloat(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
