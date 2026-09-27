import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Droplets, 
  Activity, 
  Clock,
  ExternalLink,
  Zap
} from 'lucide-react';
import { RiskPrediction, ExplainabilityData, SimilarWell } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface BeforeYouDrillProps {
  currentDepth: number;
  riskData: RiskPrediction;
  explainability: ExplainabilityData;
  topAnalogues: SimilarWell[];
  onOpenAssistant: (prompt?: string) => void;
  onOpenDepthAnalysis: () => void;
}

export const BeforeYouDrill: React.FC<BeforeYouDrillProps> = ({
  currentDepth,
  riskData,
  explainability,
  topAnalogues,
  onOpenAssistant,
  onOpenDepthAnalysis
}) => {
  const inCriticalZone = currentDepth >= 2700 && currentDepth <= 2800;

  return (
    <div className="petrol-card border-red-500/40 relative overflow-hidden bg-gradient-to-br from-[#120B16]/95 via-[#0D1724]/95 to-[#091522]/95 shadow-[0_0_30px_rgba(239,68,68,0.12)]">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-red-600/30 via-orange-600/20 to-transparent border-b border-red-500/30 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-black tracking-widest text-red-400 uppercase">
              CRITICAL WATCH INTERVAL ACTIVATED
            </span>
            <span className="text-slate-400 text-xs font-mono ml-2 hidden sm:inline">
              | Target Reservoir: Fatehgarh Lower (2,700 m – 2,800 m)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold animate-pulse">
            ELEVATED STUCK PIPE HAZARD
          </span>
          <button
            onClick={() => onOpenAssistant("What happened in nearby wells between 2700 and 2800 meters?")}
            className="flex items-center gap-1 text-brand-cyan hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
          >
            <span>Ask AI Assistant</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Core Header Story in 10 Seconds */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-[#1C2A3A]">
          <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CURRENT DEPTH</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-slate-100">{currentDepth}</span>
              <span className="text-xs font-mono text-slate-400">m MD</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Inside Critical Zone
            </span>
          </div>

          <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">HAZARD INTERVAL</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-red-400">2,700–2,800</span>
              <span className="text-xs font-mono text-slate-400">m</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Fatehgarh Lower Sandstone</span>
          </div>

          <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">OFFSET ANALOGUES</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-brand-sky">4 Wells</span>
              <span className="text-xs font-mono text-slate-400">(Avg 91% Sim)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">OIL-W087, W091, W074, W078</span>
          </div>

          <div className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">HISTORICAL NPT LOST</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-orange-400">94.5</span>
              <span className="text-xs font-mono text-slate-400">Hours</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Across 6 recorded incidents</span>
          </div>
        </div>

        {/* 4 Multi-Risk Predictions with Visual Gauges */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-cyan" />
              ML DRILLING RISK FORECAST (CURRENT BIT DEPTH)
            </span>
            <button 
              onClick={onOpenDepthAnalysis}
              className="text-[11px] font-mono text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>View Full Depth Curve (0–3500m)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Stuck Pipe */}
            <div className="p-3.5 rounded bg-[#0E1726] border border-red-500/40 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">Stuck Pipe</span>
                <RiskBadge severity={riskData.stuck_pipe.severity} />
              </div>
              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-3xl font-black text-red-400">{Math.round(riskData.stuck_pipe.probability * 100)}%</span>
                <span className="text-[10px] text-slate-400">Conf: {Math.round(riskData.stuck_pipe.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${riskData.stuck_pipe.probability * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                Historical: 4 stuck strings in offset cluster
              </span>
            </div>

            {/* Lost Circulation */}
            <div className="p-3.5 rounded bg-[#0E1726] border border-amber-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">Lost Circulation</span>
                <RiskBadge severity={riskData.lost_circulation.severity} />
              </div>
              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-3xl font-black text-amber-400">{Math.round(riskData.lost_circulation.probability * 100)}%</span>
                <span className="text-[10px] text-slate-400">Conf: {Math.round(riskData.lost_circulation.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${riskData.lost_circulation.probability * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                OIL-W087 lost 42 bbl/hr at 2,735 m
              </span>
            </div>

            {/* Kick / Gas Influx */}
            <div className="p-3.5 rounded bg-[#0E1726] border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">Kick / Influx</span>
                <RiskBadge severity={riskData.kick.severity} />
              </div>
              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-3xl font-black text-emerald-400">{Math.round(riskData.kick.probability * 100)}%</span>
                <span className="text-[10px] text-slate-400">Conf: {Math.round(riskData.kick.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${riskData.kick.probability * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                OIL-W074 took 18 bbl kick at 2,710 m
              </span>
            </div>

            {/* Non-Productive Time (NPT) */}
            <div className="p-3.5 rounded bg-[#0E1726] border border-orange-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">High NPT Risk</span>
                <RiskBadge severity={riskData.npt.severity} />
              </div>
              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-3xl font-black text-orange-400">{Math.round(riskData.npt.probability * 100)}%</span>
                <span className="text-[10px] text-slate-400">Conf: {Math.round(riskData.npt.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${riskData.npt.probability * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                Avg remedial duration: 24.8 hours
              </span>
            </div>
          </div>
        </div>

        {/* Explainable Evidence & Engineer Action Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* Historical Evidence Supporting Prediction */}
          <div className="bg-[#09121E] p-4 rounded border border-[#1C2A3A] space-y-2.5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-sky" />
              HISTORICAL OFFSET EVIDENCE
            </span>
            <ul className="space-y-2 text-xs font-sans text-slate-300">
              {explainability.evidence.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Decision Support Checklist */}
          <div className="bg-[#09121E] p-4 rounded border border-[#1C2A3A] space-y-2.5">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              RECOMMENDED PRE-DRILL MITIGATION CHECKS
            </span>
            <ul className="space-y-2 text-xs font-sans text-slate-300">
              {explainability.recommended_mitigation_checks.slice(0, 3).map((check, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{check}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
