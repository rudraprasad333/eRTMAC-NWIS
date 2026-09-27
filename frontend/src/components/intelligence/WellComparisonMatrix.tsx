import React from 'react';
import { Well, SimilarWell } from '../../types';
import { Check, AlertCircle, XCircle } from 'lucide-react';

interface WellComparisonMatrixProps {
  targetWell: Well;
  analogues: SimilarWell[];
}

export const WellComparisonMatrix: React.FC<WellComparisonMatrixProps> = ({
  targetWell,
  analogues
}) => {
  const comparisonWells = [targetWell, ...analogues.slice(0, 3)];

  return (
    <div className="petrol-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            MULTI-WELL COMPARISON MATRIX
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Side-by-side engineering, lithological, and geomechanical parameter evaluation
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1C2A3A] text-slate-400">
              <th className="pb-2.5 font-bold uppercase">PARAMETER</th>
              {comparisonWells.map((w, i) => (
                <th key={w.well_id} className={`pb-2.5 font-bold uppercase ${i === 0 ? 'text-brand-cyan font-black' : 'text-slate-200'}`}>
                  {w.well_id} {i === 0 && '(TARGET)'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C2A3A]/60 text-slate-300">
            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Overall Similarity</td>
              <td className="py-2.5 text-brand-cyan font-bold">100% (Baseline)</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-emerald-400 font-bold">
                  {Math.round(w.overall_similarity * 100)}%
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Distance to Target</td>
              <td className="py-2.5 text-slate-400">0.0 km</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-brand-sky font-semibold">
                  {w.distance_km} km
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Target Formation</td>
              <td className="py-2.5 text-white font-semibold">{targetWell.formation}</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-slate-200">
                  {w.formation}
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Lithology Profile</td>
              <td className="py-2.5 text-slate-200">{targetWell.lithology}</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-slate-200">
                  {w.lithology}
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Total Depth (TD)</td>
              <td className="py-2.5 text-brand-sky">{targetWell.total_depth} m</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-slate-200">
                  {w.total_depth} m
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Well Profile & Type</td>
              <td className="py-2.5 text-slate-200">{targetWell.trajectory_type} ({targetWell.well_type})</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-slate-200">
                  {w.trajectory_type} ({w.well_type})
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Reservoir Pressure</td>
              <td className="py-2.5 text-slate-200">{targetWell.pressure} psi</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-slate-200">
                  {w.pressure} psi
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2.5 text-slate-400 font-semibold">Primary Hazard Encountered</td>
              <td className="py-2.5 text-amber-400">Active Risk Approaching</td>
              {analogues.slice(0, 3).map((w) => (
                <td key={w.well_id} className="py-2.5 text-red-400 font-semibold">
                  {w.key_risks.join(", ")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
