import React from 'react';
import { HistoricalEvent } from '../../types';
import { Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface QuickIncidentTimelineProps {
  events: HistoricalEvent[];
  onViewAllEvents: () => void;
}

export const QuickIncidentTimeline: React.FC<QuickIncidentTimelineProps> = ({
  events,
  onViewAllEvents
}) => {
  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-sky" />
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            CRITICAL OFFSET INCIDENTS
          </h3>
        </div>
        <button
          onClick={onViewAllEvents}
          className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1"
        >
          <span>All Events</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {events.slice(0, 4).map((ev) => (
          <div
            key={ev.id}
            className="p-3 rounded bg-[#0A121D] border border-[#1C2A3A] space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-sky">{ev.well_id}</span>
                <span className="text-xs font-mono text-slate-400">@ {ev.depth} m</span>
              </div>
              <RiskBadge severity={ev.severity} />
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {ev.description}
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1C2A3A]/40">
              <span>Formation: {ev.formation}</span>
              {ev.npt_hours > 0 && <span className="text-orange-400 font-semibold">NPT: {ev.npt_hours}h</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
