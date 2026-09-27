import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Bot, 
  Zap,
  Sparkles
} from 'lucide-react';
import { TabType } from '../common/Sidebar';

interface DemoStep {
  title: string;
  stage: number;
  tab: TabType;
  description: string;
  highlightAction: string;
  tagline: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stage: 1,
    title: "1. Active Well Profile: OIL-W102",
    tab: "overview",
    description: "The engineer is currently drilling active well OIL-W102 in Barmer Basin Block-A at 2,715 m MD. The well is deviated at 28.5° heading into the primary target reservoir: Fatehgarh Sandstone.",
    highlightAction: "Target well identified with active drilling parameters and depth telemetry.",
    tagline: "Active Well Telemetry Baseline"
  },
  {
    stage: 2,
    title: "2. Spatial GIS Nearby Well Search",
    tab: "offset-wells",
    description: "The system scans the basin within a 15 km radius, locating 12 offset wells and plotting their historical risk footprints and trajectories on the high-tech GIS map.",
    highlightAction: "12 spatial offset wells mapped with risk-coded markers.",
    tagline: "Geographic Proximity Screening"
  },
  {
    stage: 3,
    title: "3. Offset Similarity Engine Calculation",
    tab: "intelligence",
    description: "Rather than relying merely on distance, the algorithm calculates multidimensional similarity (geological 35%, spatial 25%, depth 15%, formation 10%). Top analogues identified: OIL-W087 (94%), OIL-W091 (91%), and OIL-W074 (88%).",
    highlightAction: "Top 3 high-confidence geological analogues selected.",
    tagline: "Multidimensional Geological Similarity"
  },
  {
    stage: 4,
    title: "4. Historical Incident Detection",
    tab: "depth",
    description: "Offset historical data reveals that between 2,700 m and 2,800 m, analogue wells experienced severe non-productive time: OIL-W087 suffered 42 bbl/hr lost circulation at 2,735m and a 4.2h stuck pipe at 2,742m.",
    highlightAction: "94.5 hours of historical NPT mapped in the 2,700–2,800m interval.",
    tagline: "Hazard Depth Correlation"
  },
  {
    stage: 5,
    title: "5. Live Drilling Simulation Advancement",
    tab: "live",
    description: "As the simulated drill string advances into the 2,715m–2,740m zone, telemetry shows surface torque rising to 24.8 kft-lbs and ROP decelerating due to formation drag.",
    highlightAction: "Live parameter streams trigger real-time anomaly detection.",
    tagline: "Real-Time Telemetry Streaming"
  },
  {
    stage: 6,
    title: "6. ML Risk Forecast Engine",
    tab: "risk",
    description: "Trained Random Forest and Gradient Boosting models evaluate live telemetry against offset historical signatures. Stuck Pipe probability spikes to 82% (High/Critical) and Lost Circulation to 64%.",
    highlightAction: "ML risk classifier outputs multi-hazard probability spectrum.",
    tagline: "Predictive Risk Modeling"
  },
  {
    stage: 7,
    title: "7. Explainable AI & Evidence Breakdown",
    tab: "risk",
    description: "The system explains WHY: 4 similar offset wells got stuck, lithology is swelling shale interbedded with permeable sand, torque is +38% elevated, and mud overbalance is +480 psi.",
    highlightAction: "SHAP feature importances and historical evidence citations displayed.",
    tagline: "Transparent Decision Rationale"
  },
  {
    stage: 8,
    title: "8. Proactive Drill-Floor Alert Triggered",
    tab: "alerts",
    description: "A proactive CRITICAL alert is dispatched: 'Historical Risk Zone Approaching (2,700–2,800 m)'. The engineer is advised to restrict static survey breaks to < 5 minutes.",
    highlightAction: "Early-warning alert delivered before entering high-risk zone.",
    tagline: "Proactive Collision & Hazard Avoidance"
  },
  {
    stage: 9,
    title: "9. 'Ask the Wells' RAG Knowledge Assistant",
    tab: "assistant",
    description: "The engineer asks the AI: 'What mud weight and LCM pills did OIL-W087 use?'. The RAG assistant retrieves the exact End of Well Report (EOWR) citing the 30 bbl nut-plug/mica pill.",
    highlightAction: "Natural language query answered with exact offset report citations.",
    tagline: "Semantic Knowledge Retrieval"
  },
  {
    stage: 10,
    title: "10. 'Before You Drill' Engineering Decision",
    tab: "overview",
    description: "In under 10 seconds, the drilling engineer reviews the comprehensive Before-You-Drill dashboard, conditions the mud with 2% lubricant, schedules a short wiper trip, and safely navigates the critical interval!",
    highlightAction: "Mission accomplished: Learn from every well before drilling the next one.",
    tagline: "Evidence-Based Decision Support"
  }
];

interface DemoTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const DemoTourOverlay: React.FC<DemoTourOverlayProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const step = DEMO_STEPS[currentStepIdx];
      onNavigateTab(step.tab);
    }
  }, [isOpen, currentStepIdx]);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg animate-fade-in pointer-events-auto">
      <div className="petrol-card p-5 border-brand-cyan/60 shadow-[0_0_30px_rgba(34,184,207,0.3)] bg-[#07111F]/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan font-mono text-xs font-bold animate-pulse">
              {currentStep.stage}
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-cyan uppercase font-bold tracking-widest block">
                INTERACTIVE DEMO TOUR • STAGE {currentStep.stage}/10
              </span>
              <h4 className="font-mono text-xs font-bold text-slate-100">
                {currentStep.tagline}
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-3 space-y-2">
          <h3 className="font-mono text-sm font-bold text-brand-sky">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentStep.description}
          </p>
          <div className="bg-[#0A121D] p-2 rounded border border-[#1C2A3A] flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{currentStep.highlightAction}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1C2A3A]">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {DEMO_STEPS.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentStepIdx(i)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  i === currentStepIdx
                    ? 'bg-brand-cyan w-4'
                    : i < currentStepIdx
                    ? 'bg-brand-blue'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="px-2.5 py-1.5 rounded bg-[#16253B] hover:bg-[#1E334F] disabled:opacity-30 text-slate-200 font-mono text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <span>{currentStepIdx === DEMO_STEPS.length - 1 ? 'Finish Demo' : 'Next Stage'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
