import React, { memo } from 'react';

export const CinematicBackground: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#07111F]">
      {/* 1. Subtle Deep Vignette & Atmospheric Radial Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/90 via-[#07111F]/70 to-[#040912]/95" />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 75% 15%, rgba(47, 128, 237, 0.08) 0%, rgba(34, 184, 207, 0.03) 35%, transparent 70%)'
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 85%, rgba(47, 128, 237, 0.04) 0%, transparent 60%)'
        }}
      />

      {/* 2. Technical Coordinate Grid & Elevation Cross-Hairs */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(47, 128, 237, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(47, 128, 237, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px'
        }}
      />
      
      {/* 3. High-Tech Precision Coordinate & Depth Tick Markers */}
      <div className="absolute top-6 right-10 text-[10px] font-mono text-[#2F80ED]/25 tracking-widest flex flex-col items-end gap-1">
        <span>GRID REF: BB-A-2575-7138</span>
        <span>SURFACE ELV: +142.4 m MSL</span>
        <span>LAT: 25°45'04.32" N | LON: 71°23'06.18" E</span>
      </div>

      {/* 4. Large-Scale Background SVG: Geological Strata, Drilling Rig Silhouette, Well Trajectories & Contours */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="strata1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#22B8CF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.03" />
          </linearGradient>

          <linearGradient id="strataCritical" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#EF4444" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="wellboreGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22B8CF" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#2F80ED" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="offsetWellGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.05" />
          </linearGradient>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- HORIZON & GEOLOGICAL FORMATION STRATA BOUNDARIES --- */}
        {/* Ground Surface Line */}
        <line x1="0" y1="260" x2="1920" y2="260" stroke="#2F80ED" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="6 4" />
        <text x="60" y="252" fill="#2F80ED" fillOpacity="0.25" fontSize="10" fontFamily="monospace">0 m — GROUND LEVEL / CASING HEAD</text>

        {/* Strata Layer 1: Thumbli Claystone (350m - 1150m) */}
        <path d="M 0 380 Q 480 370, 960 395 T 1920 385" stroke="#2F80ED" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M 0 380 Q 480 370, 960 395 T 1920 385 L 1920 540 Q 1440 530, 960 550 T 0 535 Z" fill="url(#strata1)" />
        <text x="60" y="375" fill="#2F80ED" fillOpacity="0.2" fontSize="9" fontFamily="monospace">350 m — TOP THUMBLI CLAYSTONE</text>

        {/* Strata Layer 2: Dharvi Dungar (1150m - 1950m) */}
        <path d="M 0 540 Q 480 530, 960 550 T 1920 535" stroke="#2F80ED" strokeOpacity="0.12" strokeWidth="1" />
        <text x="60" y="535" fill="#2F80ED" fillOpacity="0.2" fontSize="9" fontFamily="monospace">1,150 m — TOP DHARVI DUNGAR SILTSTONE</text>

        {/* Strata Layer 3: Barmer Hill Shale (1950m - 2650m) */}
        <path d="M 0 710 Q 520 695, 1040 725 T 1920 705" stroke="#2F80ED" strokeOpacity="0.15" strokeWidth="1.2" />
        <text x="60" y="705" fill="#2F80ED" fillOpacity="0.22" fontSize="9" fontFamily="monospace">1,950 m — TOP BARMER HILL SHALE</text>

        {/* Strata Layer 4: CRITICAL ZONE - Fatehgarh Lower (2700m - 2800m) */}
        <path d="M 0 840 Q 560 830, 1100 855 T 1920 835" stroke="#EF4444" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="8 4" />
        <path d="M 0 840 Q 560 830, 1100 855 T 1920 835 L 1920 930 Q 1380 915, 880 940 T 0 925 Z" fill="url(#strataCritical)" />
        <text x="60" y="835" fill="#EF4444" fillOpacity="0.35" fontSize="10" fontFamily="monospace" fontWeight="bold">2,700 m — CRITICAL INTERVAL: FATEHGARH LOWER (STUCK PIPE HAZARD ZONE)</text>

        {/* Strata Layer 5: Nagana Volcanics / Basement (2850m+) */}
        <path d="M 0 930 Q 480 920, 1000 945 T 1920 925" stroke="#2F80ED" strokeOpacity="0.15" strokeWidth="1" />
        <text x="60" y="945" fill="#2F80ED" fillOpacity="0.2" fontSize="9" fontFamily="monospace">2,850 m — NAGANA VOLCANICS / BASEMENT</text>

        {/* --- GEOLOGICAL CONTOUR LINES (Subtle 3D Structural Anticlinal Feature) --- */}
        <g opacity="0.08" stroke="#22B8CF" strokeWidth="0.75" fill="none">
          <ellipse cx="1350" cy="800" rx="380" ry="110" />
          <ellipse cx="1350" cy="800" rx="290" ry="85" />
          <ellipse cx="1350" cy="800" rx="200" ry="60" />
          <ellipse cx="1350" cy="800" rx="110" ry="35" />
          {/* Seismic Fault Discontinuity */}
          <line x1="1080" y1="650" x2="1220" y2="980" stroke="#2F80ED" strokeWidth="1.2" strokeDasharray="5 3" />
          <text x="1090" y="665" fill="#22B8CF" fontSize="8" fontFamily="monospace">FAULT F-04 [THROW: 35m]</text>
        </g>

        {/* --- DRILLING RIG SILHOUETTE (Far Background, upper right) --- */}
        <g opacity="0.12" transform="translate(1380, 70) scale(0.65)">
          {/* Substructure & Rig Mast */}
          <polygon points="120,290 140,40 160,40 180,290" fill="none" stroke="#2F80ED" strokeWidth="2.5" />
          <line x1="120" y1="290" x2="180" y2="40" stroke="#2F80ED" strokeWidth="1" />
          <line x1="180" y1="290" x2="140" y2="40" stroke="#2F80ED" strokeWidth="1" />
          {/* Cross Bracing */}
          <line x1="125" y1="240" x2="175" y2="240" stroke="#2F80ED" strokeWidth="1.5" />
          <line x1="130" y1="190" x2="170" y2="190" stroke="#2F80ED" strokeWidth="1.5" />
          <line x1="135" y1="140" x2="165" y2="140" stroke="#2F80ED" strokeWidth="1.5" />
          <line x1="138" y1="90" x2="162" y2="90" stroke="#2F80ED" strokeWidth="1.5" />
          {/* Crown Block & Derrick Top */}
          <rect x="136" y="25" width="28" height="15" fill="none" stroke="#2F80ED" strokeWidth="2" />
          {/* Travelling Block & Drill Line */}
          <line x1="150" y1="40" x2="150" y2="160" stroke="#22B8CF" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="144" y="160" width="12" height="20" fill="none" stroke="#22B8CF" strokeWidth="1.5" />
          {/* Drill Floor Substructure */}
          <rect x="90" y="290" width="120" height="20" fill="none" stroke="#2F80ED" strokeWidth="2" />
          <line x1="100" y1="310" x2="100" y2="340" stroke="#2F80ED" strokeWidth="2" />
          <line x1="200" y1="310" x2="200" y2="340" stroke="#2F80ED" strokeWidth="2" />
          {/* Rig Beacon Light Glow */}
          <circle cx="150" cy="25" r="4" fill="#22B8CF" filter="url(#subtleGlow)" />
        </g>

        {/* --- WELL TRAJECTORIES (Underground 3D paths) --- */}
        {/* Active Well OIL-W102 (Deviated S-Curve Trajectory) */}
        <path
          d="M 1475 260 L 1475 390 C 1475 490, 1420 580, 1370 700 C 1330 790, 1310 830, 1300 855"
          fill="none"
          stroke="url(#wellboreGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#subtleGlow)"
        />
        {/* Active Well Current Bit Position (2,715 m) */}
        <circle cx="1300" cy="855" r="5" fill="#EF4444" filter="url(#subtleGlow)" />
        <circle cx="1300" cy="855" r="9" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" className="animate-ping origin-center" />
        <text x="1318" y="858" fill="#22B8CF" fontSize="11" fontFamily="monospace" fontWeight="bold">OIL-W102 (CURRENT BIT: 2,715 m)</text>

        {/* Planned Path to TD (3,450 m) */}
        <path
          d="M 1300 855 C 1290 880, 1275 940, 1260 1020"
          fill="none"
          stroke="#2F80ED"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeOpacity="0.4"
        />
        <text x="1272" y="1025" fill="#2F80ED" fillOpacity="0.3" fontSize="9" fontFamily="monospace">PLANNED TD: 3,450 m</text>

        {/* Offset Well 1: OIL-W087 (94% Analogue - Stuck Pipe at 2,742m) */}
        <path
          d="M 1620 260 L 1620 380 C 1620 480, 1580 620, 1540 760 C 1520 830, 1505 880, 1495 990"
          fill="none"
          stroke="url(#offsetWellGlow)"
          strokeWidth="2"
          strokeDasharray="6 3"
        />
        <circle cx="1508" cy="875" r="4" fill="#EF4444" fillOpacity="0.7" />
        <text x="1518" y="878" fill="#EF4444" fillOpacity="0.6" fontSize="9" fontFamily="monospace">OIL-W087 (STUCK @ 2,742 m)</text>

        {/* Offset Well 2: OIL-W091 (91% Analogue - Torque Spikes at 2,760m) */}
        <path
          d="M 1220 260 L 1220 420 C 1220 540, 1180 680, 1150 820 C 1130 900, 1120 960, 1110 1000"
          fill="none"
          stroke="url(#offsetWellGlow)"
          strokeWidth="2"
          strokeDasharray="6 3"
        />
        <circle cx="1140" cy="888" r="4" fill="#F59E0B" fillOpacity="0.7" />
        <text x="1030" y="890" fill="#F59E0B" fillOpacity="0.6" fontSize="9" fontFamily="monospace">OIL-W091 (TORQUE @ 2,760 m)</text>

        {/* Offset Well 3: OIL-W074 (88% Analogue - Kick & Stuck at 2,780m) */}
        <path
          d="M 1760 260 L 1760 450 C 1760 590, 1720 730, 1680 870 L 1660 1010"
          fill="none"
          stroke="url(#offsetWellGlow)"
          strokeWidth="1.8"
          strokeDasharray="6 3"
        />
        <circle cx="1680" cy="870" r="4" fill="#EF4444" fillOpacity="0.7" />
        <text x="1692" y="873" fill="#EF4444" fillOpacity="0.6" fontSize="9" fontFamily="monospace">OIL-W074 (KICK @ 2,710m / STUCK @ 2,780m)</text>

        {/* Additional Offset Wells (Vertical & Deviated) */}
        <path d="M 880 260 L 880 950" stroke="#2F80ED" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 640 260 L 640 500 C 640 650, 680 800, 710 920" stroke="#2F80ED" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Faint Data Connection Flow Lines Between Offset Wells */}
        <g opacity="0.15" stroke="#22B8CF" strokeWidth="1" strokeDasharray="2 4">
          <line x1="1300" y1="855" x2="1508" y2="875" />
          <line x1="1300" y1="855" x2="1140" y2="888" />
          <line x1="1508" y1="875" x2="1680" y2="870" />
        </g>
      </svg>

      {/* 5. EMBEDDED WATERMARK LOGO / BRANDING (5-8% subtle opacity in upper/center-right background) */}
      <div className="absolute top-28 right-16 pointer-events-none opacity-[0.06] select-none text-right">
        <div className="flex items-center justify-end gap-3">
          <div className="w-12 h-12 rounded border border-[#2F80ED] flex items-center justify-center">
            <span className="font-mono text-2xl font-black text-[#2F80ED] tracking-tighter">NW</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-4xl font-extrabold tracking-widest text-[#2F80ED] uppercase font-mono leading-none">
              eRTMAC
            </span>
            <span className="text-xl font-bold tracking-[0.3em] text-[#22B8CF] uppercase font-mono leading-tight">
              NWIS
            </span>
          </div>
        </div>
        <p className="text-xs font-mono tracking-widest text-slate-300 uppercase mt-2">
          Nearby Wells Intelligence System
        </p>
        <p className="text-[10px] font-mono tracking-wider text-slate-400 mt-0.5">
          AI-POWERED OFFSET WELL DECISION SUPPORT
        </p>
      </div>

      {/* 6. Subtle Technical Grid Waveforms at Bottom */}
      <div className="absolute bottom-4 left-10 text-[9px] font-mono text-[#2F80ED]/20 tracking-wider flex items-center gap-6">
        <span>STRATIGRAPHIC CORRELATION: ACTIVE (30 ANALOGUES)</span>
        <span>SEISMIC FAULT INVERSION: VALIDATED</span>
        <span>OFFSET DATA RETRIEVAL: 100% SYNCHRONIZED</span>
      </div>
    </div>
  );
});

CinematicBackground.displayName = 'CinematicBackground';
