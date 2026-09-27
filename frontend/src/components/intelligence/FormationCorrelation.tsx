import React from 'react';
import { Formation, SimilarWell } from '../../types';

interface FormationCorrelationProps {
  formations: Formation[];
  activeDepth: number;
  topWells: SimilarWell[];
}

export const FormationCorrelation: React.FC<FormationCorrelationProps> = ({
  formations,
  activeDepth,
  topWells
}) => {
  const maxDepth = 3500;

  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            SUBSURFACE STRATIGRAPHIC CROSS-SECTION CORRELATION
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Lithological tops, fault offsets, and historical incident markers across offset wells
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-blue/20 text-brand-sky border border-brand-blue/30">
          BARMER BASIN TRANSECT A-A'
        </span>
      </div>

      {/* Stratigraphic Columns Comparison */}
      <div className="grid grid-cols-4 gap-4 h-[420px] pt-2">
        {/* Active Well OIL-W102 */}
        <div className="bg-[#0A121D] p-3 rounded border border-cyan-500/40 flex flex-col relative overflow-hidden">
          <div className="text-center pb-2 border-b border-[#1C2A3A]">
            <span className="font-mono text-xs font-black text-brand-cyan block">OIL-W102</span>
            <span className="text-[10px] font-mono text-slate-400">Target (28.5° DEV)</span>
          </div>

          <div className="relative flex-1 mt-2 flex flex-col justify-between">
            {formations.map((f) => {
              const heightPercent = ((f.bottom_depth - f.top_depth) / maxDepth) * 100;
              const isFatehgarh = f.formation_name.includes("Fatehgarh");
              const isCurrent = activeDepth >= f.top_depth && activeDepth < f.bottom_depth;

              return (
                <div
                  key={f.id}
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full border-b border-slate-700/60 p-1 flex flex-col justify-center transition-all ${
                    isCurrent ? 'bg-red-500/20 ring-1 ring-red-500' : (isFatehgarh ? 'bg-brand-blue/10' : 'bg-slate-900/40')
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold text-slate-200 truncate">{f.formation_name}</span>
                  <span className="text-[8px] font-mono text-slate-400">{f.top_depth}m - {f.bottom_depth}m</span>
                </div>
              );
            })}

            {/* Active Bit Depth Cursor */}
            <div
              style={{ top: `${(activeDepth / maxDepth) * 100}%` }}
              className="absolute left-0 right-0 border-t-2 border-red-500 flex items-center justify-between pointer-events-none z-10"
            >
              <span className="bg-red-500 text-white text-[8px] font-mono font-bold px-1 rounded-r">
                BIT @ {activeDepth}m
              </span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping mr-1" />
            </div>
          </div>
        </div>

        {/* Offset Wells: OIL-W087, OIL-W091, OIL-W074 */}
        {topWells.slice(0, 3).map((well) => (
          <div key={well.well_id} className="bg-[#0A121D] p-3 rounded border border-[#1C2A3A] flex flex-col relative overflow-hidden">
            <div className="text-center pb-2 border-b border-[#1C2A3A]">
              <span className="font-mono text-xs font-bold text-slate-200 block">{well.well_id}</span>
              <span className="text-[10px] font-mono text-brand-sky">{Math.round(well.overall_similarity * 100)}% Sim ({well.distance_km}km)</span>
            </div>

            <div className="relative flex-1 mt-2 flex flex-col justify-between">
              {formations.map((f) => {
                const heightPercent = ((f.bottom_depth - f.top_depth) / maxDepth) * 100;
                const isFatehgarh = f.formation_name.includes("Fatehgarh");

                return (
                  <div
                    key={f.id}
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full border-b border-slate-700/60 p-1 flex flex-col justify-center ${
                      isFatehgarh ? 'bg-amber-500/10' : 'bg-slate-900/30'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400 truncate">{f.formation_name}</span>
                    <span className="text-[8px] font-mono text-slate-400">{f.top_depth}m</span>
                  </div>
                );
              })}

              {/* Historical Incident Markers */}
              {well.well_id === 'OIL-W087' && (
                <>
                  <div style={{ top: `${(2735 / maxDepth) * 100}%` }} className="absolute left-0 right-0 border-t border-amber-400 flex items-center z-10">
                    <span className="bg-amber-500 text-slate-950 text-[8px] font-mono font-bold px-1 rounded-r">
                      2,735m: Mud Loss 42 bbl/h
                    </span>
                  </div>
                  <div style={{ top: `${(2742 / maxDepth) * 100}%` }} className="absolute left-0 right-0 border-t-2 border-red-500 flex items-center z-10">
                    <span className="bg-red-500 text-white text-[8px] font-mono font-bold px-1 rounded-r">
                      2,742m: Stuck Pipe (4.2h jar)
                    </span>
                  </div>
                </>
              )}

              {well.well_id === 'OIL-W091' && (
                <div style={{ top: `${(2760 / maxDepth) * 100}%` }} className="absolute left-0 right-0 border-t-2 border-orange-500 flex items-center z-10">
                  <span className="bg-orange-500 text-white text-[8px] font-mono font-bold px-1 rounded-r">
                    2,760m: 32 kft-lb Torque Spike
                  </span>
                </div>
              )}

              {well.well_id === 'OIL-W074' && (
                <div style={{ top: `${(2780 / maxDepth) * 100}%` }} className="absolute left-0 right-0 border-t-2 border-red-500 flex items-center z-10">
                  <span className="bg-red-500 text-white text-[8px] font-mono font-bold px-1 rounded-r">
                    2,780m: Differential Stuck
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
