import React from 'react';
import { SimilarWell } from '../../types';
import { Layers, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

interface TopAnaloguesCardProps {
  analogues: SimilarWell[];
  onSelectWell: (well: SimilarWell) => void;
  onViewAll: () => void;
}

export const TopAnaloguesCard: React.FC<TopAnaloguesCardProps> = ({
  analogues,
  onSelectWell,
  onViewAll
}) => {
  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-cyan" />
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            TOP GEOLOGICAL ANALOGUES
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
        >
          <span>All 30 Offsets</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {analogues.slice(0, 3).map((well, idx) => {
          const simScore = Math.round(well.overall_similarity * 100);
          return (
            <div
              key={well.well_id}
              onClick={() => onSelectWell(well)}
              className="p-3 rounded bg-[#0A121D] hover:bg-[#121E30] border border-[#1C2A3A] hover:border-brand-blue/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 text-[11px] font-mono font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors">
                      {well.well_id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">
                      ({well.distance_km} km away)
                    </span>
                  </div>
                </div>

                {/* Similarity score badge */}
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs text-slate-400">Match:</span>
                  <span className={`text-xs font-bold ${
                    simScore >= 90 ? 'text-emerald-400' : simScore >= 80 ? 'text-brand-cyan' : 'text-amber-400'
                  }`}>
                    {simScore}%
                  </span>
                </div>
              </div>

              {/* Similarity breakdown bars */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#1C2A3A]/60 text-[10px] font-mono text-slate-400">
                <div>
                  <span className="block text-[9px] text-slate-400">GEOLOGY</span>
                  <span className="font-semibold text-slate-300">{Math.round(well.geological_similarity * 100)}%</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400">LITHOLOGY</span>
                  <span className="font-semibold text-slate-300">{Math.round((well.formation_similarity || 0.9) * 100)}%</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400">OPERATIONS</span>
                  <span className="font-semibold text-slate-300">{Math.round((well.operational_similarity || 0.88) * 100)}%</span>
                </div>
              </div>

              {/* Key Incident Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {well.key_risks.map((risk, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 text-[9px] font-mono font-medium"
                  >
                    ⚠ {risk}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
