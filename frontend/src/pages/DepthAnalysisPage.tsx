import React from 'react';
import { DepthRiskItem, Formation, HistoricalEvent } from '../types';
import { DepthRiskChart } from '../components/depth/DepthRiskChart';
import { StratigraphyColumn } from '../components/depth/StratigraphyColumn';
import { TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface DepthAnalysisPageProps {
  depthData: DepthRiskItem[];
  formations: Formation[];
  currentDepth: number;
  events: HistoricalEvent[];
}

export const DepthAnalysisPage: React.FC<DepthAnalysisPageProps> = ({
  depthData,
  formations,
  currentDepth,
  events
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Depth Risk Curve */}
      <DepthRiskChart
        data={depthData}
        currentDepth={currentDepth}
      />

      {/* Stratigraphy Column & Historical Events Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StratigraphyColumn
          formations={formations}
          activeDepth={currentDepth}
        />

        {/* Detailed Historical Incidents Log along Depth */}
        <div className="petrol-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-sky" />
              <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
                OFFSET DRILLING INCIDENT REGISTER
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Depth-Indexed
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded bg-[#0A121D] border border-[#1C2A3A] space-y-2 hover:border-brand-blue/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-sky">{ev.well_id}</span>
                    <span className="text-xs font-mono text-amber-400 font-bold">@ {ev.depth} m</span>
                  </div>
                  <RiskBadge severity={ev.severity} />
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {ev.description}
                </p>

                {ev.mitigation && (
                  <div className="bg-[#121B28] p-2 rounded border border-[#1C2A3A]/60 text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-semibold">Remedial Action: </span>
                    {ev.mitigation}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1C2A3A]/40">
                  <span>Formation: {ev.formation}</span>
                  {ev.npt_hours > 0 && <span className="text-orange-400 font-bold">NPT Impact: {ev.npt_hours}h</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
