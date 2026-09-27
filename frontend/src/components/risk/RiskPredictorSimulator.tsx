import React, { useState } from 'react';
import { RiskPrediction } from '../../types';
import { api } from '../../services/api';
import { Cpu, RefreshCw, Zap } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface RiskPredictorSimulatorProps {
  onPredictionUpdated?: (pred: RiskPrediction) => void;
}

export const RiskPredictorSimulator: React.FC<RiskPredictorSimulatorProps> = ({
  onPredictionUpdated
}) => {
  const [depth, setDepth] = useState(2715);
  const [torque, setTorque] = useState(24.8);
  const [rop, setRop] = useState(14.2);
  const [wob, setWob] = useState(18.5);
  const [rpm, setRpm] = useState(110);
  const [mudWeight, setMudWeight] = useState(10.8);
  const [pressure, setPressure] = useState(3450);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskPrediction | null>(null);

  const runPrediction = async () => {
    setLoading(true);
    try {
      const pred = await api.predictCustomRisk({
        well_id: "OIL-W102",
        current_depth: depth,
        formation: depth >= 2700 && depth <= 2850 ? "Fatehgarh Lower" : "Barmer Hill Shale",
        rop,
        wob,
        rpm,
        torque,
        mud_weight: mudWeight,
        pressure
      });
      setResult(pred);
      if (onPredictionUpdated) onPredictionUpdated(pred);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-cyan" />
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            INTERACTIVE ML RISK INFERENCE SIMULATOR
          </h3>
        </div>
        <button
          onClick={runPrediction}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-brand-blue hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>EVALUATE RISKS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input Sliders */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Depth:</span>
              <span className="text-brand-sky font-bold">{depth} m</span>
            </div>
            <input
              type="range"
              min="500"
              max="3500"
              step="25"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-brand-blue h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Torque:</span>
              <span className="text-amber-400 font-bold">{torque} kft-lb</span>
            </div>
            <input
              type="range"
              min="8"
              max="36"
              step="0.5"
              value={torque}
              onChange={(e) => setTorque(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Mud Weight:</span>
              <span className="text-cyan-400 font-bold">{mudWeight} ppg</span>
            </div>
            <input
              type="range"
              min="9.0"
              max="12.5"
              step="0.1"
              value={mudWeight}
              onChange={(e) => setMudWeight(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>ROP:</span>
              <span className="text-slate-200 font-bold">{rop} m/hr</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="0.5"
              value={rop}
              onChange={(e) => setRop(parseFloat(e.target.value))}
              className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Live Forecast Card Output */}
        <div className="bg-[#0A121D] p-3 rounded border border-brand-blue/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            INFERENCE PREDICTION:
          </span>

          <div className="space-y-2 my-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Stuck Pipe:</span>
              <RiskBadge severity={result ? result.stuck_pipe.severity : 'HIGH'} probability={result ? result.stuck_pipe.probability : 0.82} />
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Lost Circulation:</span>
              <RiskBadge severity={result ? result.lost_circulation.severity : 'MEDIUM_HIGH'} probability={result ? result.lost_circulation.probability : 0.64} />
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Kick / Influx:</span>
              <RiskBadge severity={result ? result.kick.severity : 'LOW'} probability={result ? result.kick.probability : 0.27} />
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 border-t border-[#1C2A3A] pt-1.5">
            Model: Scikit Random Forest Ensemble
          </div>
        </div>
      </div>
    </div>
  );
};
