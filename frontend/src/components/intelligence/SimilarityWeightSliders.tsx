import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';

interface SimilarityWeights {
  geological: number;
  spatial: number;
  depth: number;
  formation: number;
  drilling_design: number;
  historical_performance: number;
}

interface SimilarityWeightSlidersProps {
  weights: SimilarityWeights;
  onChange: (weights: SimilarityWeights) => void;
  onReset: () => void;
}

export const SimilarityWeightSliders: React.FC<SimilarityWeightSlidersProps> = ({
  weights,
  onChange,
  onReset
}) => {
  const updateWeight = (key: keyof SimilarityWeights, val: number) => {
    onChange({
      ...weights,
      [key]: val / 100
    });
  };

  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-cyan" />
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            OFFSET SIMILARITY ENGINE WEIGHT TUNING
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 font-sans">
        Calibrate multidimensional algorithm weighting factors for offset well ranking. Current composite sum: <span className="font-mono text-brand-cyan font-bold">{Math.round(total * 100)}%</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Geological Similarity (35%) */}
        <div className="space-y-1.5 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Geological & Lithology (35%):</span>
            <span className="text-brand-sky font-bold">{Math.round(weights.geological * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.geological * 100)}
            onChange={(e) => updateWeight('geological', parseInt(e.target.value))}
            className="w-full accent-brand-blue h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Spatial Proximity (25%) */}
        <div className="space-y-1.5 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Spatial Proximity (25%):</span>
            <span className="text-brand-cyan font-bold">{Math.round(weights.spatial * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.spatial * 100)}
            onChange={(e) => updateWeight('spatial', parseInt(e.target.value))}
            className="w-full accent-brand-cyan h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Depth Similarity (15%) */}
        <div className="space-y-1.5 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Depth Profile (15%):</span>
            <span className="text-purple-400 font-bold">{Math.round(weights.depth * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.depth * 100)}
            onChange={(e) => updateWeight('depth', parseInt(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Formation Match (10%) */}
        <div className="space-y-1.5 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Formation Boundary (10%):</span>
            <span className="text-emerald-400 font-bold">{Math.round(weights.formation * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.formation * 100)}
            onChange={(e) => updateWeight('formation', parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Drilling Design (10%) */}
        <div className="space-y-1.5 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Well Design & Trajectory (10%):</span>
            <span className="text-amber-400 font-bold">{Math.round(weights.drilling_design * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.drilling_design * 100)}
            onChange={(e) => updateWeight('drilling_design', parseInt(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Historical Performance (5%) */}
        <div className="space-y-1.5 bg-[#0A121D] p-3 rounded border border-[#1C2A3A]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Historical Incidents (5%):</span>
            <span className="text-rose-400 font-bold">{Math.round(weights.historical_performance * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.historical_performance * 100)}
            onChange={(e) => updateWeight('historical_performance', parseInt(e.target.value))}
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
