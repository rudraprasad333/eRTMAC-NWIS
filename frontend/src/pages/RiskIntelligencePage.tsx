import React, { useState } from 'react';
import { RiskPrediction, ExplainabilityData } from '../types';
import { FeatureImportanceChart } from '../components/risk/FeatureImportanceChart';
import { RiskPredictorSimulator } from '../components/risk/RiskPredictorSimulator';
import { RiskBadge } from '../components/common/RiskBadge';
import { ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

interface RiskIntelligencePageProps {
  riskData: RiskPrediction;
  explainability: ExplainabilityData;
}

export const RiskIntelligencePage: React.FC<RiskIntelligencePageProps> = ({
  riskData,
  explainability
}) => {
  const [currentRisk, setCurrentRisk] = useState<RiskPrediction>(riskData);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Multi-Risk Hazard Overview Cards */}
      <div className="petrol-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h2 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wider">
              ML DRILLING HAZARD INFERENCE SPECTRUM
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Ensemble: Random Forest + Gradient Boosting • Evaluated @ {currentRisk.depth} m
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Stuck Pipe */}
          <div className="bg-[#0A121D] p-3.5 rounded border border-red-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">Stuck Pipe</span>
              <RiskBadge severity={currentRisk.stuck_pipe.severity} />
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-3xl font-black text-red-400">{Math.round(currentRisk.stuck_pipe.probability * 100)}%</span>
              <span className="text-[10px] text-slate-400">Conf: {Math.round(currentRisk.stuck_pipe.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${currentRisk.stuck_pipe.probability * 100}%` }} />
            </div>
          </div>

          {/* Lost Circulation */}
          <div className="bg-[#0A121D] p-3.5 rounded border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">Lost Circ.</span>
              <RiskBadge severity={currentRisk.lost_circulation.severity} />
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-3xl font-black text-amber-400">{Math.round(currentRisk.lost_circulation.probability * 100)}%</span>
              <span className="text-[10px] text-slate-400">Conf: {Math.round(currentRisk.lost_circulation.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentRisk.lost_circulation.probability * 100}%` }} />
            </div>
          </div>

          {/* Kick / Influx */}
          <div className="bg-[#0A121D] p-3.5 rounded border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">Kick Influx</span>
              <RiskBadge severity={currentRisk.kick.severity} />
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-3xl font-black text-emerald-400">{Math.round(currentRisk.kick.probability * 100)}%</span>
              <span className="text-[10px] text-slate-400">Conf: {Math.round(currentRisk.kick.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentRisk.kick.probability * 100}%` }} />
            </div>
          </div>

          {/* High Torque */}
          <div className="bg-[#0A121D] p-3.5 rounded border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">High Torque</span>
              <RiskBadge severity={currentRisk.high_torque.severity} />
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-3xl font-black text-purple-400">{Math.round(currentRisk.high_torque.probability * 100)}%</span>
              <span className="text-[10px] text-slate-400">Conf: {Math.round(currentRisk.high_torque.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${currentRisk.high_torque.probability * 100}%` }} />
            </div>
          </div>

          {/* NPT Risk */}
          <div className="bg-[#0A121D] p-3.5 rounded border border-orange-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">NPT Risk</span>
              <RiskBadge severity={currentRisk.npt.severity} />
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-3xl font-black text-orange-400">{Math.round(currentRisk.npt.probability * 100)}%</span>
              <span className="text-[10px] text-slate-400">Conf: {Math.round(currentRisk.npt.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: `${currentRisk.npt.probability * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Attribution */}
      <FeatureImportanceChart contributingFactors={explainability.contributing_factors} />

      {/* Interactive Risk Simulator */}
      <RiskPredictorSimulator onPredictionUpdated={(pred) => setCurrentRisk(pred)} />
    </div>
  );
};
