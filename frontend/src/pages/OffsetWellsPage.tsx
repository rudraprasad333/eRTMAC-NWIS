import React, { useState } from 'react';
import { Well, NearbyWell, SimilarWell } from '../types';
import { WellMap } from '../components/gis/WellMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  MapPin, 
  Search, 
  Filter, 
  Sliders, 
  Download, 
  Compass, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface OffsetWellsPageProps {
  targetWell: Well;
  offsetWells: (NearbyWell | SimilarWell)[];
  onSelectWell: (well: SimilarWell) => void;
}

export const OffsetWellsPage: React.FC<OffsetWellsPageProps> = ({
  targetWell,
  offsetWells,
  onSelectWell
}) => {
  const [radiusKm, setRadiusKm] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [formationFilter, setFormationFilter] = useState('ALL');
  const [selectedWell, setSelectedWell] = useState<SimilarWell | null>(null);

  const filteredWells = offsetWells.filter((w) => {
    const matchesSearch = w.well_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.formation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormation = formationFilter === 'ALL' || w.formation.includes(formationFilter);
    const matchesRadius = (w as any).distance_km ? (w as any).distance_km <= radiusKm : true;
    return matchesSearch && matchesFormation && matchesRadius;
  });

  const exportCSV = () => {
    const headers = ["Well ID", "Distance (km)", "Formation", "Lithology", "TD (m)", "Trajectory", "Similarity (%)"];
    const rows = filteredWells.map(w => [
      w.well_id,
      (w as any).distance_km || 'N/A',
      `"${w.formation}"`,
      `"${w.lithology}"`,
      w.total_depth,
      w.trajectory_type,
      (w as any).overall_similarity ? Math.round((w as any).overall_similarity * 100) : 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `offset_wells_radius_${radiusKm}km.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls Bar */}
      <div className="petrol-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1C2A3A]">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-cyan" />
              <h2 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wider">
                OFFSET WELLS GEOSPATIAL INTELLIGENCE (GIS)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Interactive spatial clustering, historical incident footprints, and trajectory projections centered on target <span className="text-brand-sky font-bold">OIL-W102</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#16253B] hover:bg-[#1E334F] text-slate-200 font-mono text-xs border border-[#1C2A3A] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Radius Slider */}
          <div className="space-y-1 bg-[#0A121D] p-2.5 rounded border border-[#1C2A3A]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Search Radius:</span>
              <span className="text-brand-sky font-bold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
              className="w-full accent-brand-blue h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offset well ID or formation..."
              className="w-full bg-[#0A121D] border border-[#1C2A3A] rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-400 outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Formation Filter */}
          <div className="flex items-center gap-2">
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="w-full bg-[#0A121D] border border-[#1C2A3A] rounded px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-brand-cyan"
            >
              <option value="ALL">All Formations (30 Wells)</option>
              <option value="Fatehgarh Lower">Fatehgarh Lower (High Risk)</option>
              <option value="Fatehgarh Upper">Fatehgarh Upper</option>
              <option value="Barmer Hill">Barmer Hill Shale</option>
              <option value="Nagana">Nagana Volcanics</option>
            </select>
          </div>
        </div>
      </div>

      {/* GIS Map */}
      <WellMap
        targetWell={targetWell}
        offsetWells={filteredWells}
        searchRadiusKm={radiusKm}
        onSelectWell={(w) => setSelectedWell(w as SimilarWell)}
        heightClass="h-[480px]"
      />

      {/* Offset Well Inventory Table */}
      <div className="petrol-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
            OFFSET WELL INVENTORY ({filteredWells.length} WELLS FILTERED)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Click any row to view analogue detail & comparison
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1C2A3A] text-slate-400">
                <th className="pb-2.5 font-bold uppercase">WELL ID</th>
                <th className="pb-2.5 font-bold uppercase">DISTANCE</th>
                <th className="pb-2.5 font-bold uppercase">FORMATION</th>
                <th className="pb-2.5 font-bold uppercase">LITHOLOGY</th>
                <th className="pb-2.5 font-bold uppercase">TOTAL DEPTH</th>
                <th className="pb-2.5 font-bold uppercase">SIMILARITY</th>
                <th className="pb-2.5 font-bold uppercase">HISTORICAL INCIDENTS</th>
                <th className="pb-2.5 font-bold uppercase">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2A3A]/60 text-slate-300">
              {filteredWells.map((well) => {
                const simScore = (well as any).overall_similarity 
                  ? Math.round((well as any).overall_similarity * 100) 
                  : 85;

                return (
                  <tr
                    key={well.well_id}
                    onClick={() => onSelectWell(well as SimilarWell)}
                    className="hover:bg-[#121E30] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 font-bold text-brand-sky group-hover:text-brand-cyan">
                      {well.well_id}
                    </td>
                    <td className="py-3 text-slate-200">
                      {(well as any).distance_km} km
                    </td>
                    <td className="py-3 text-white">
                      {well.formation}
                    </td>
                    <td className="py-3 text-slate-400">
                      {well.lithology}
                    </td>
                    <td className="py-3 text-slate-200">
                      {well.total_depth} m
                    </td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        simScore >= 90 ? 'text-emerald-400' : simScore >= 80 ? 'text-brand-cyan' : 'text-amber-400'
                      }`}>
                        {simScore}%
                      </span>
                    </td>
                    <td className="py-3">
                      {(well as any).key_risks ? (
                        <div className="flex flex-wrap gap-1">
                          {(well as any).key_risks.map((r: string, idx: number) => (
                            <span key={idx} className="px-1.5 py-0.2 rounded bg-red-500/15 text-red-300 border border-red-500/30 text-[9px]">
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">Nominal</span>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWell(well as SimilarWell);
                        }}
                        className="text-brand-cyan hover:underline flex items-center gap-0.5 text-[11px]"
                      >
                        <span>Compare</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
