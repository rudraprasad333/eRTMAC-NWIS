import React from 'react';
import { 
  Well, 
  RiskPrediction, 
  ExplainabilityData, 
  SimilarWell, 
  HistoricalEvent,
  AlertItem 
} from '../types';
import { BeforeYouDrill } from '../components/dashboard/BeforeYouDrill';
import { ActiveWellCard } from '../components/dashboard/ActiveWellCard';
import { TopAnaloguesCard } from '../components/dashboard/TopAnaloguesCard';
import { QuickIncidentTimeline } from '../components/dashboard/QuickIncidentTimeline';
import { WellMap } from '../components/gis/WellMap';
import { KpiCard } from '../components/common/KpiCard';
import { 
  Activity, 
  ShieldAlert, 
  Layers, 
  Compass, 
  AlertTriangle, 
  ArrowDownRight,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { TabType } from '../components/common/Sidebar';

interface OverviewPageProps {
  activeWell: Well;
  currentDepth: number;
  riskData: RiskPrediction;
  explainability: ExplainabilityData;
  topAnalogues: SimilarWell[];
  historicalEvents: HistoricalEvent[];
  alerts: AlertItem[];
  onNavigateTab: (tab: TabType) => void;
  onSelectWell: (well: SimilarWell) => void;
  onAskAssistant: (prompt?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  activeWell,
  currentDepth,
  riskData,
  explainability,
  topAnalogues,
  historicalEvents,
  alerts,
  onNavigateTab,
  onSelectWell,
  onAskAssistant
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Flagship Centerpiece: BEFORE YOU DRILL */}
      <BeforeYouDrill
        currentDepth={currentDepth}
        riskData={riskData}
        explainability={explainability}
        topAnalogues={topAnalogues}
        onOpenAssistant={onAskAssistant}
        onOpenDepthAnalysis={() => onNavigateTab('depth')}
      />

      {/* 2. Key Operational Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="ACTIVE BIT DEPTH"
          value={currentDepth.toLocaleString()}
          unit="m MD"
          icon={ArrowDownRight}
          subtitle="Target TD: 3,450 m"
          trend="78.7% Complete"
          trendType="positive"
          statusBorder="cyan"
        />

        <KpiCard
          title="PRIMARY OFFSET ANALOGUE"
          value="OIL-W087"
          unit="(94% Sim)"
          icon={Layers}
          subtitle="Distance: 1.2 km away"
          trend="2 Historical Incidents"
          trendType="critical"
          statusBorder="warning"
        />

        <KpiCard
          title="TORQUE & DRAG PROFILE"
          value="24.8"
          unit="kft-lbs"
          icon={Gauge}
          subtitle="Baseline: 16.0 kft-lbs"
          trend="+38% Elevation Spike"
          trendType="critical"
          statusBorder="critical"
        />

        <KpiCard
          title="ACTIVE DRILLING ADVISORIES"
          value={alerts.filter(a => !a.acknowledged).length}
          unit="Active"
          icon={AlertTriangle}
          subtitle="Critical Zone Window"
          trend="1 Critical Alert Active"
          trendType="critical"
          statusBorder="critical"
        />
      </div>

      {/* 3. Core Operational Split View: Active Well Telemetry + Top Analogues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveWellCard
          well={activeWell}
          currentDepth={currentDepth}
        />

        <TopAnaloguesCard
          analogues={topAnalogues}
          onSelectWell={onSelectWell}
          onViewAll={() => onNavigateTab('intelligence')}
        />
      </div>

      {/* 4. Subsurface GIS Geospatial Overview + Historical Incident Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-cyan" />
              REGIONAL OFFSET WELLS GIS CLUSTER (15 KM RADIUS)
            </span>
            <button
              onClick={() => onNavigateTab('offset-wells')}
              className="text-xs font-mono text-brand-cyan hover:underline"
            >
              Open Full Interactive GIS Map →
            </button>
          </div>
          <WellMap
            targetWell={activeWell}
            offsetWells={topAnalogues}
            searchRadiusKm={15}
            onSelectWell={(w) => onNavigateTab('intelligence')}
            heightClass="h-[360px]"
          />
        </div>

        <div>
          <QuickIncidentTimeline
            events={historicalEvents}
            onViewAllEvents={() => onNavigateTab('depth')}
          />
        </div>
      </div>
    </div>
  );
};
