import React from 'react';
import { Formation } from '../../types';

interface StratigraphyColumnProps {
  formations: Formation[];
  activeDepth: number;
}

export const StratigraphyColumn: React.FC<StratigraphyColumnProps> = ({
  formations,
  activeDepth
}) => {
  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            LITHOLOGICAL STRATIGRAPHY COLUMN
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Regional geological column with pore pressure regimes and hazards
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {formations.map((f) => {
          const isCurrent = activeDepth >= f.top_depth && activeDepth < f.bottom_depth;
          const isCritical = f.formation_name.includes("Fatehgarh Lower");

          return (
            <div
              key={f.id}
              className={`p-3 rounded border transition-all ${
                isCurrent 
                  ? 'bg-red-500/15 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                  : isCritical
                  ? 'bg-[#140C18] border-red-500/30'
                  : 'bg-[#0A121D] border-[#1C2A3A]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: f.color_code }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-100">
                        {f.formation_name}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 rounded bg-red-500 text-white text-[9px] font-mono font-bold animate-pulse">
                          ACTIVE BIT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Lithology: {f.lithology}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-brand-sky">{f.top_depth}m – {f.bottom_depth}m</span>
                  <span className="text-[10px] text-slate-400 block">{f.pressure_regime}</span>
                </div>
              </div>

              {f.risk_characteristics && (
                <div className="mt-2 text-[10px] font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-[#1C2A3A]/40">
                  <span className="text-amber-400 font-semibold">Hazards: </span>
                  {f.risk_characteristics}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
