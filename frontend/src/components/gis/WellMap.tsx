import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Well, NearbyWell, SimilarWell } from '../../types';

// Custom Map Marker Icons using SVGs
const createCustomIcon = (color: string, isTarget: boolean = false, label?: string) => {
  const size = isTarget ? 34 : 24;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="#07111F" stroke-width="1.5">
      ${isTarget ? `
        <circle cx="12" cy="12" r="10" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="3 3" class="animate-spin" />
        <circle cx="12" cy="12" r="5" fill="${color}" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="${color}" stroke-width="2" />
      ` : `
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      `}
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="display:flex; flex-direction:column; align-items:center; filter: drop-shadow(0 0 6px ${color});">${svg}${label ? `<span style="font-family:monospace; font-size:9px; font-weight:bold; color:#FFFFFF; background:#07111F; padding:1px 4px; border-radius:3px; border:1px solid ${color}; white-space:nowrap; margin-top:-2px;">${label}</span>` : ''}</div>`,
    iconSize: [size, size + (label ? 14 : 0)],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

interface WellMapProps {
  targetWell: Well;
  offsetWells: (NearbyWell | SimilarWell)[];
  searchRadiusKm?: number;
  onSelectWell?: (well: Well) => void;
  heightClass?: string;
}

export const WellMap: React.FC<WellMapProps> = ({
  targetWell,
  offsetWells,
  searchRadiusKm = 15,
  onSelectWell,
  heightClass = "h-[520px]"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [targetWell.latitude, targetWell.longitude],
        zoom: 11,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &bull; eRTMAC-NWIS GIS Engine',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([targetWell.latitude, targetWell.longitude], 11);

    // Clear existing overlay layers (markers, circles, lines)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const targetPos: [number, number] = [targetWell.latitude, targetWell.longitude];

    // Radius Circle
    L.circle(targetPos, {
      radius: searchRadiusKm * 1000,
      color: '#2F80ED',
      fillColor: '#2F80ED',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '6, 6'
    }).addTo(map);

    // Connection lines
    offsetWells.slice(0, 4).forEach((offset) => {
      L.polyline([targetPos, [offset.latitude, offset.longitude]], {
        color: offset.well_id === 'OIL-W087' ? '#EF4444' : '#22B8CF',
        weight: 1.2,
        dashArray: '4, 4',
        opacity: 0.6
      }).addTo(map);
    });

    // Target Well Marker
    const targetMarker = L.marker(targetPos, {
      icon: createCustomIcon('#00D2FF', true, targetWell.well_id)
    }).addTo(map);

    targetMarker.bindPopup(`
      <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-family: monospace; font-size: 12px; font-weight: bold; color: #00D2FF;">
            ★ ACTIVE TARGET: ${targetWell.well_id}
          </span>
          <span style="font-size: 10px; font-family: monospace; background: rgba(16, 185, 129, 0.2); color: #34D399; padding: 1px 4px; border-radius: 3px;">
            DRILLING
          </span>
        </div>
        <div style="font-size: 11px; font-family: monospace; color: #CBD5E1; line-height: 1.5;">
          <div>Formation: <strong style="color: #FFFFFF;">${targetWell.formation}</strong></div>
          <div>Total Depth: <span style="color: #38BDF8;">${targetWell.total_depth} m</span></div>
          <div>Trajectory: ${targetWell.trajectory_type} (${targetWell.well_type})</div>
          <div>Reservoir: ${targetWell.target_reservoir}</div>
        </div>
      </div>
    `);

    // Offset Wells Markers
    offsetWells.forEach((offset) => {
      const isHighRisk = (offset as any).major_events_count >= 2 || (offset as any).risk_level === 'CRITICAL';
      const isMediumRisk = (offset as any).major_events_count === 1 || (offset as any).risk_level === 'HIGH';
      const pinColor = isHighRisk ? '#EF4444' : (isMediumRisk ? '#F59E0B' : '#22C55E');
      const simScore = (offset as any).overall_similarity 
        ? Math.round((offset as any).overall_similarity * 100) 
        : undefined;

      const marker = L.marker([offset.latitude, offset.longitude], {
        icon: createCustomIcon(pinColor, false, offset.well_id)
      }).addTo(map);

      const risksHtml = (offset as any).key_risks 
        ? `<div style="margin-top: 4px;">
             <span style="font-size: 10px; color: #94A3B8; display: block;">Historical Incidents:</span>
             <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px;">
               ${(offset as any).key_risks.map((r: string) => `<span style="font-size: 9px; padding: 1px 4px; background: rgba(239, 68, 68, 0.2); color: #FCA5A5; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 2px;">${r}</span>`).join('')}
             </div>
           </div>`
        : '';

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; color: #F8FAFC;">
              ${offset.well_id}
            </span>
            ${simScore !== undefined ? `<span style="font-size: 10px; font-family: monospace; background: rgba(47, 128, 237, 0.2); color: #22B8CF; padding: 1px 4px; border-radius: 3px; font-weight: bold;">${simScore}% Sim</span>` : ''}
          </div>
          <div style="font-size: 11px; font-family: monospace; color: #CBD5E1; line-height: 1.5;">
            <div>Distance: <strong style="color: #38BDF8;">${(offset as any).distance_km} km</strong></div>
            <div>Formation: ${offset.formation}</div>
            <div>Total Depth: ${offset.total_depth} m</div>
            ${risksHtml}
          </div>
        </div>
      `);
    });

  }, [targetWell, offsetWells, searchRadiusKm]);

  return (
    <div className={`petrol-card overflow-hidden relative ${heightClass}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#07111F]/90 backdrop-blur-md border border-[#1C2A3A] p-2.5 rounded-md text-[10px] font-mono space-y-1.5 text-slate-300 shadow-xl pointer-events-auto">
        <span className="font-bold text-slate-200 block border-b border-[#1C2A3A] pb-1 uppercase">GIS LAYER LEGEND</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40" />
          <span>Active Target (OIL-W102)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>High-Risk Offset (Stuck Pipe / Kick)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Moderate Risk (Torque / Loss)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Nominal Offset Well</span>
        </div>
      </div>
    </div>
  );
};
