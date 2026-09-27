import {
  Well,
  NearbyWell,
  SimilarWell,
  Formation,
  HistoricalEvent,
  RiskPrediction,
  DepthRiskItem,
  ExplainabilityData,
  DocumentItem,
  AlertItem,
  SimulationState
} from '../types';

export const MOCK_ACTIVE_WELL: Well = {
  id: 1,
  well_id: "OIL-W102",
  latitude: 25.7512,
  longitude: 71.3850,
  field_name: "Barmer Basin Block-A",
  formation: "Fatehgarh Lower",
  lithology: "Glauconitic Sandstone / Shale",
  total_depth: 3450.0,
  well_type: "Deviated",
  spud_date: "2026-08-14",
  pressure: 3450.0,
  temperature: 118.0,
  status: "Drilling",
  trajectory_type: "S-Type",
  target_reservoir: "Fatehgarh Sandstone"
};

export const MOCK_FORMATIONS: Formation[] = [
  { id: 1, formation_name: "Quaternary Alluvium", top_depth: 0, bottom_depth: 350, lithology: "Unconsolidated Sand & Gravel", pressure_regime: "Normal (8.6 ppg)", risk_characteristics: "Surface hole washout, lost circulation in gravel beds", color_code: "#D97706" },
  { id: 2, formation_name: "Thumbli Claystone", top_depth: 350, bottom_depth: 1150, lithology: "Lignitic Claystone & Siltstone", pressure_regime: "Normal (8.9 ppg)", risk_characteristics: "Bit balling, reactive clay swelling", color_code: "#059669" },
  { id: 3, formation_name: "Dharvi Dungar Siltstone", top_depth: 1150, bottom_depth: 1950, lithology: "Interbedded Sandstone & Claystone", pressure_regime: "Normal (9.2 ppg)", risk_characteristics: "Mild tight hole on trips, abrasive sand streaks", color_code: "#0284C7" },
  { id: 4, formation_name: "Barmer Hill Shale", top_depth: 1950, bottom_depth: 2650, lithology: "Siliceous Porcelanite & Organic Shale", pressure_regime: "Slight Overpressure (9.8 ppg)", risk_characteristics: "Brittle shale caving, wellbore sloughing, torque spikes", color_code: "#4F46E5" },
  { id: 5, formation_name: "Fatehgarh Upper", top_depth: 2650, bottom_depth: 2700, lithology: "Fluvial Coarse Sandstone", pressure_regime: "Transitional (10.2 ppg)", risk_characteristics: "Seepage losses, differential sticking in porous intervals", color_code: "#7C3AED" },
  { id: 6, formation_name: "Fatehgarh Lower", top_depth: 2700, bottom_depth: 2850, lithology: "Glauconitic Sandstone & Fractured Shale", pressure_regime: "Overpressured Reservoir (10.8 ppg)", risk_characteristics: "CRITICAL RISK: Differential sticking, severe lost circulation, gas influx/kick, excessive drag", color_code: "#E11D48" },
  { id: 7, formation_name: "Nagana Volcanics / Basement", top_depth: 2850, bottom_depth: 3600, lithology: "Basalt & Fractured Rhyolite", pressure_regime: "Sub-normal to Depleted (9.4 ppg)", risk_characteristics: "High vibration, severe drill bit wear, lost circulation in fracture corridors", color_code: "#475569" }
];

export const MOCK_SIMILAR_WELLS: SimilarWell[] = [
  {
    id: 2,
    well_id: "OIL-W087",
    latitude: 25.7594,
    longitude: 71.3925,
    field_name: "Barmer Basin Block-A",
    formation: "Fatehgarh Lower",
    lithology: "Glauconitic Sandstone / Shale",
    total_depth: 3420.0,
    well_type: "Deviated",
    spud_date: "2025-03-10",
    completion_date: "2025-05-15",
    pressure: 3480.0,
    temperature: 119.5,
    status: "Completed",
    trajectory_type: "S-Type",
    target_reservoir: "Fatehgarh Sandstone",
    distance_km: 1.2,
    bearing_deg: 42.5,
    geological_similarity: 0.94,
    spatial_similarity: 0.88,
    depth_similarity: 0.96,
    formation_similarity: 1.0,
    drilling_design_similarity: 0.95,
    historical_performance: 0.85,
    operational_similarity: 0.91,
    overall_similarity: 0.94,
    key_risks: ["Lost Circulation (42 bbl/hr)", "Stuck Pipe (4.2h jar)"],
    major_events_count: 2
  },
  {
    id: 3,
    well_id: "OIL-W091",
    latitude: 25.7367,
    longitude: 71.4010,
    field_name: "Barmer Basin Block-A",
    formation: "Fatehgarh Lower",
    lithology: "Glauconitic Sandstone / Shale",
    total_depth: 3390.0,
    well_type: "Deviated",
    spud_date: "2025-06-22",
    completion_date: "2025-08-30",
    pressure: 3420.0,
    temperature: 117.0,
    status: "Completed",
    trajectory_type: "J-Type",
    target_reservoir: "Fatehgarh Sandstone",
    distance_km: 2.4,
    bearing_deg: 138.2,
    geological_similarity: 0.91,
    spatial_similarity: 0.76,
    depth_similarity: 0.93,
    formation_similarity: 1.0,
    drilling_design_similarity: 0.88,
    historical_performance: 0.80,
    operational_similarity: 0.86,
    overall_similarity: 0.91,
    key_risks: ["High Torque (32 kft-lbs)", "Wellbore Instability"],
    major_events_count: 2
  },
  {
    id: 4,
    well_id: "OIL-W074",
    latitude: 25.7732,
    longitude: 71.3640,
    field_name: "Barmer Basin Block-A",
    formation: "Fatehgarh Lower",
    lithology: "Glauconitic Sandstone / Fractured Shale",
    total_depth: 3500.0,
    well_type: "Deviated",
    spud_date: "2024-11-05",
    completion_date: "2025-01-20",
    pressure: 3510.0,
    temperature: 121.0,
    status: "Completed",
    trajectory_type: "S-Type",
    target_reservoir: "Fatehgarh Sandstone",
    distance_km: 3.8,
    bearing_deg: 312.4,
    geological_similarity: 0.88,
    spatial_similarity: 0.65,
    depth_similarity: 0.92,
    formation_similarity: 1.0,
    drilling_design_similarity: 0.92,
    historical_performance: 0.85,
    operational_similarity: 0.87,
    overall_similarity: 0.88,
    key_risks: ["Stuck Pipe (Key-seat)", "Gas Influx Kick"],
    major_events_count: 2
  },
  {
    id: 5,
    well_id: "OIL-W065",
    latitude: 25.7232,
    longitude: 71.3670,
    field_name: "Barmer Basin Block-A",
    formation: "Fatehgarh Lower",
    lithology: "Glauconitic Sandstone",
    total_depth: 3410.0,
    well_type: "Deviated",
    spud_date: "2024-07-19",
    status: "Completed",
    trajectory_type: "S-Type",
    target_reservoir: "Fatehgarh Sandstone",
    distance_km: 3.6,
    bearing_deg: 210.1,
    geological_similarity: 0.86,
    spatial_similarity: 0.67,
    depth_similarity: 0.95,
    formation_similarity: 1.0,
    drilling_design_similarity: 0.90,
    historical_performance: 0.65,
    operational_similarity: 0.82,
    overall_similarity: 0.85,
    key_risks: ["Seepage Losses (18 bbl/hr)"],
    major_events_count: 1
  },
  {
    id: 6,
    well_id: "OIL-W078",
    latitude: 25.8032,
    longitude: 71.3500,
    field_name: "Barmer Basin Block-A",
    formation: "Fatehgarh Lower",
    lithology: "Glauconitic Sandstone",
    total_depth: 3480.0,
    well_type: "Deviated",
    spud_date: "2025-01-18",
    status: "Completed",
    trajectory_type: "S-Type",
    target_reservoir: "Fatehgarh Sandstone",
    distance_km: 6.8,
    bearing_deg: 334.8,
    geological_similarity: 0.84,
    spatial_similarity: 0.44,
    depth_similarity: 0.94,
    formation_similarity: 1.0,
    drilling_design_similarity: 0.89,
    historical_performance: 0.65,
    operational_similarity: 0.79,
    overall_similarity: 0.81,
    key_risks: ["Tight Hole on Trip"],
    major_events_count: 1
  },
  {
    id: 7,
    well_id: "OIL-W083",
    latitude: 25.7622,
    longitude: 71.3730,
    field_name: "Barmer Basin Block-A",
    formation: "Fatehgarh Lower",
    lithology: "Glauconitic Sandstone",
    total_depth: 3400.0,
    well_type: "Deviated",
    spud_date: "2025-02-28",
    status: "Completed",
    trajectory_type: "S-Type",
    target_reservoir: "Fatehgarh Sandstone",
    distance_km: 1.7,
    bearing_deg: 308.2,
    geological_similarity: 0.85,
    spatial_similarity: 0.82,
    depth_similarity: 0.94,
    formation_similarity: 1.0,
    drilling_design_similarity: 0.90,
    historical_performance: 0.60,
    operational_similarity: 0.81,
    overall_similarity: 0.84,
    key_risks: ["Pore Pressure Ramp (+0.9 ppg)"],
    major_events_count: 1
  }
];

export const MOCK_RISK_PREDICTION: RiskPrediction = {
  well_id: "OIL-W102",
  depth: 2715.0,
  formation: "Fatehgarh Lower (Glauconitic Sandstone)",
  stuck_pipe: {
    probability: 0.82,
    severity: "HIGH",
    confidence: 0.86,
    historical_frequency: 0.68,
    analogous_incidents: 4
  },
  lost_circulation: {
    probability: 0.64,
    severity: "MEDIUM_HIGH",
    confidence: 0.81,
    historical_frequency: 0.54,
    analogous_incidents: 3
  },
  kick: {
    probability: 0.27,
    severity: "LOW",
    confidence: 0.74,
    historical_frequency: 0.24,
    analogous_incidents: 1
  },
  high_torque: {
    probability: 0.85,
    severity: "CRITICAL",
    confidence: 0.88,
    historical_frequency: 0.62,
    analogous_incidents: 5
  },
  npt: {
    probability: 0.71,
    severity: "HIGH",
    confidence: 0.84,
    historical_frequency: 0.71,
    analogous_incidents: 6
  }
};

export const MOCK_EXPLAINABILITY: ExplainabilityData = {
  well_id: "OIL-W102",
  depth: 2715.0,
  formation: "Fatehgarh Lower (2,700m - 2,850m)",
  risk_type: "STUCK_PIPE",
  probability: 0.82,
  confidence: 0.86,
  evidence: [
    "4 high-similarity offset wells experienced stuck pipe in the 2,700–2,800 m interval (OIL-W087 at 2,742m, OIL-W074 at 2,780m, OIL-W078 at 2,755m).",
    "Current lithology consists of highly permeable Glauconitic Sandstone interbedded with reactive swelling shale.",
    "Historical torque in analogue wells increased by +68% within 20m of the current depth marker.",
    "Historical ROP in comparable wells dropped sharply from 18.2 m/hr to 6.8 m/hr due to differential drag.",
    "Mud weight overbalance of +480 psi exceeds the recommended 350 psi threshold for this formation pressure regime."
  ],
  contributing_factors: {
    "Lithology & Formation Vulnerability": 0.38,
    "Offset Incident Frequency": 0.26,
    "Torque & Drag Elevation": 0.18,
    "Differential Mud Overbalance": 0.12,
    "BHA & Dogleg Severity": 0.06
  },
  analogous_wells: [
    {
      well_id: "OIL-W087",
      similarity: "94%",
      event: "Differential Sticking & Lost Circulation",
      depth: "2,735m – 2,742m",
      impact: "28.5 Hours NPT",
      resolution: "Jarred down with 110 klbs; spotted 45 bbl oil-based release pill."
    },
    {
      well_id: "OIL-W091",
      similarity: "91%",
      event: "High Torque Spikes & Wellbore Instability",
      depth: "2,760m",
      impact: "19.5 Hours NPT",
      resolution: "Conducted wiper trip to 2,650m and dosed 2% lubricity additive."
    },
    {
      well_id: "OIL-W074",
      similarity: "88%",
      event: "Key-Seating & Gas Influx Kick",
      depth: "2,710m – 2,780m",
      impact: "41.5 Hours NPT",
      resolution: "Circulated out gas via Wait & Weight; spotted acid wash pill."
    }
  ],
  recommended_mitigation_checks: [
    "Perform short wiper trip back to 2,650 m casing shoe before proceeding beyond 2,730 m.",
    "Condition active mud system to lower fluid loss (< 4 cc/30min) and add 1.5–2.0% lubricant.",
    "Avoid leaving drill string stationary on bottom during MWD survey intervals (> 5 min).",
    "Ensure pipe-freeing lubricant pills and high-viscosity sweep pills are pre-mixed in standby tanks.",
    "Maintain mud weight strictly within 10.6 – 10.8 ppg window to prevent simultaneous loss and kick."
  ]
};

export const MOCK_HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 1,
    well_id: "OIL-W087",
    depth: 2735.0,
    event_type: "LOST_CIRCULATION",
    severity: "HIGH",
    description: "Severe partial lost circulation (42 bbl/hr) upon entering fractured porous sand streak in Fatehgarh Lower.",
    duration: 18.5,
    npt_hours: 14.0,
    formation: "Fatehgarh Lower",
    mitigation: "Pumped 30 bbl medium LCM pill (nut plug + mica). Reduced mud weight from 11.2 to 10.8 ppg."
  },
  {
    id: 2,
    well_id: "OIL-W087",
    depth: 2742.0,
    event_type: "STUCK_PIPE",
    severity: "CRITICAL",
    description: "Differential sticking while stationary for survey at 2,742 m. Overbalance estimated at 480 psi.",
    duration: 34.0,
    npt_hours: 28.5,
    formation: "Fatehgarh Lower",
    mitigation: "Spotted 45 bbl pipe-release oil-based pill. Jarred down with 110 klbs for 4.2 hours to free BHA."
  },
  {
    id: 3,
    well_id: "OIL-W091",
    depth: 2760.0,
    event_type: "HIGH_TORQUE",
    severity: "HIGH",
    description: "Erratic surface torque fluctuations exceeding 32 kft-lbs with severe stick-slip oscillations.",
    duration: 12.0,
    npt_hours: 8.5,
    formation: "Fatehgarh Lower",
    mitigation: "Wiper trip performed to 2,650 m. Conditioned mud with 2% lubricant additive to reduce wall friction."
  },
  {
    id: 4,
    well_id: "OIL-W074",
    depth: 2780.0,
    event_type: "STUCK_PIPE",
    severity: "HIGH",
    description: "Mechanical key-seating and differential sticking on trip-out at 2,780 m. High overpull of 90 klbs.",
    duration: 26.0,
    npt_hours: 22.0,
    formation: "Fatehgarh Lower",
    mitigation: "Pumped acid wash pill and worked pipe with maximum torque and rotary jarring."
  },
  {
    id: 5,
    well_id: "OIL-W074",
    depth: 2710.0,
    event_type: "KICK",
    severity: "HIGH",
    description: "Gas influx kick (18 bbl pit gain, SIDPP 320 psi) while penetrating upper sand lens.",
    duration: 22.0,
    npt_hours: 19.5,
    formation: "Fatehgarh Lower",
    mitigation: "Shut-in well with annular BOP, circulated out kick gas using Wait and Weight method with 11.1 ppg kill mud."
  },
  {
    id: 6,
    well_id: "OIL-W071",
    depth: 2240.0,
    event_type: "WELLBORE_INSTABILITY",
    severity: "HIGH",
    description: "Severe cavings causing pack-off and lost bottom hole assembly in Barmer Hill Shale.",
    duration: 48.0,
    npt_hours: 42.0,
    formation: "Barmer Hill Shale",
    mitigation: "Fishing operation unsuccessful. Plugged back and sidetracked well."
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "ALT-CRIT-001",
    well_id: "OIL-W102",
    depth: 2715.0,
    severity: "CRITICAL",
    title: "Historical Risk Zone Active (2,700–2,800 m)",
    message: "Well OIL-W102 is operating within the historically challenging Fatehgarh Lower interval (depth: 2,715 m). 4 high-similarity offset wells experienced severe stuck pipe and loss incidents in this exact window.",
    risk_zone: "2,700 m – 2,800 m (Fatehgarh Lower)",
    similar_wells_count: 4,
    timestamp: "10:42:15 UTC",
    acknowledged: false,
    action_suggestion: "Review offset analogue mud weights (OIL-W087, OIL-W074). Restrict stationary drill string time to under 5 minutes during surveys."
  },
  {
    id: "ALT-WARN-002",
    well_id: "OIL-W102",
    depth: 2715.0,
    severity: "WARNING",
    title: "Elevated Torque & Drag Anomaly",
    message: "Surface rotary torque (24.8 kft-lbs) is 38% above baseline for this depth. Analogue OIL-W091 exhibited identical torque spikes prior to severe stick-slip and pack-off.",
    risk_zone: "2,740 m – 2,770 m",
    similar_wells_count: 3,
    timestamp: "10:40:02 UTC",
    acknowledged: false,
    action_suggestion: "Perform wiper trip to casing shoe (2,650m) if torque spikes exceed 28 kft-lbs. Consider adding 2% drill-glide lubricity agent."
  },
  {
    id: "ALT-INFO-004",
    well_id: "OIL-W102",
    depth: 2715.0,
    severity: "INFO",
    title: "Offset Analogue Correlation Loaded",
    message: "30 regional offset wells analyzed. Top analogues identified: OIL-W087 (94%), OIL-W091 (91%), OIL-W074 (88%).",
    risk_zone: "Full Well Section",
    similar_wells_count: 12,
    timestamp: "10:15:00 UTC",
    acknowledged: true,
    action_suggestion: "Continuous real-time correlation active. Decision support recommendations synchronized."
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 1,
    filename: "OIL-W087_End_Of_Well_Report_EOWR.pdf",
    well_id: "OIL-W087",
    document_type: "End of Well Report",
    upload_date: "2025-05-20T14:30:00Z",
    extraction_status: "COMPLETED",
    indexed_status: "INDEXED",
    extracted_text: "WELL SUMMARY REPORT: OIL-W087 (Barmer Basin Block-A). Total Depth: 3,420 m MD. Key Operational Highlights: At 2,735 m, experienced sudden 42 bbl/hr mud losses into fractured permeable interval. Spotted 30 bbl LCM pill. At 2,742 m, became differentially stuck with 480 psi overbalance. Spotted 45 bbl release pill and jarred downward for 4.2 hours.",
    file_size_kb: 245.8
  },
  {
    id: 2,
    filename: "OIL-W091_Daily_Drilling_Report_DDR_2760m.pdf",
    well_id: "OIL-W091",
    document_type: "Daily Drilling Report",
    upload_date: "2025-07-06T09:15:00Z",
    extraction_status: "COMPLETED",
    indexed_status: "INDEXED",
    extracted_text: "DAILY DRILLING LOG - WELL OIL-W091. Interval: 2,700 m to 2,810 m MD. Activity Summary: At 2,760 m, observed severe stick-slip and erratic torque fluctuations peaking at 32 kft-lbs. Conducted wiper trip to 2,650 m casing shoe and added 2% lubricant additive.",
    file_size_kb: 182.4
  },
  {
    id: 3,
    filename: "OIL-W074_Incident_Investigation_Stuck_Pipe.pdf",
    well_id: "OIL-W074",
    document_type: "Incident Investigation",
    upload_date: "2025-01-25T11:45:00Z",
    extraction_status: "COMPLETED",
    indexed_status: "INDEXED",
    extracted_text: "INCIDENT INVESTIGATION REPORT: Well OIL-W074 Stuck Pipe at 2,780 m MD. Root Cause: High differential pressure between 11.2 ppg mud column and depleted upper Fatehgarh sand lens. Total NPT: 22.0 Hours.",
    file_size_kb: 312.0
  },
  {
    id: 4,
    filename: "Barmer_Basin_Fatehgarh_Geomechanical_Study.pdf",
    document_type: "Geomechanical Study",
    upload_date: "2024-12-10T16:00:00Z",
    extraction_status: "COMPLETED",
    indexed_status: "INDEXED",
    extracted_text: "REGIONAL GEOMECHANICAL MODEL & DRILLING HAZARDS: BARMER BASIN. Pore pressure in Fatehgarh Lower increases sharply from 10.0 ppg equiv to 10.8 ppg equiv. Fracture gradient is narrow (12.3 ppg equiv).",
    file_size_kb: 514.2
  },
  {
    id: 5,
    filename: "OIL-W102_Well_Drilling_Program_Approved.pdf",
    well_id: "OIL-W102",
    document_type: "Well Program",
    upload_date: "2026-08-01T08:00:00Z",
    extraction_status: "COMPLETED",
    indexed_status: "INDEXED",
    extracted_text: "APPROVED DRILLING PROGRAM: WELL OIL-W102 (Target TD: 3,450 m). Critical Watch Interval: 2,700 m to 2,800 m. Standard guideline: Review offset analogue records (OIL-W087, OIL-W091, OIL-W074).",
    file_size_kb: 410.5
  }
];

export const generateMockDepthProfile = (): DepthRiskItem[] => {
  const depths = [];
  for (let d = 100; d <= 3500; d += 50) {
    const in_crit = d >= 2700 && d <= 2800;
    let sp = 0.08, lc = 0.06, kk = 0.03, tq = 0.12, np = 0.08, form = "Dharvi Dungar Siltstone";
    
    if (d < 350) form = "Quaternary Alluvium";
    else if (d < 1150) form = "Thumbli Claystone";
    else if (d < 1950) form = "Dharvi Dungar Siltstone";
    else if (d < 2650) {
      form = "Barmer Hill Shale";
      sp = 0.28 + ((d - 1950) / 700) * 0.25;
      lc = 0.18;
      kk = 0.08;
      tq = 0.42 + ((d - 1950) / 700) * 0.20;
      np = sp * 0.85;
    } else if (d <= 2800) {
      form = "Fatehgarh Lower (Critical)";
      const factor = Math.max(0, 1 - Math.abs(d - 2750) / 100);
      sp = 0.55 + factor * 0.27;
      lc = 0.40 + factor * 0.24;
      kk = 0.15 + factor * 0.12;
      tq = 0.60 + factor * 0.25;
      np = 0.48 + factor * 0.23;
    } else if (d <= 2850) {
      form = "Fatehgarh Lower";
      sp = 0.45; lc = 0.32; kk = 0.14; tq = 0.50; np = 0.38;
    } else {
      form = "Nagana Volcanics";
      sp = 0.15; lc = 0.35; kk = 0.05; tq = 0.55; np = 0.32;
    }

    depths.push({
      depth: d,
      formation: form,
      stuck_pipe: Number(Math.min(0.99, Math.max(0.02, sp)).toFixed(2)),
      lost_circulation: Number(Math.min(0.99, Math.max(0.02, lc)).toFixed(2)),
      kick: Number(Math.min(0.99, Math.max(0.02, kk)).toFixed(2)),
      high_torque: Number(Math.min(0.99, Math.max(0.02, tq)).toFixed(2)),
      npt: Number(Math.min(0.99, Math.max(0.02, np)).toFixed(2)),
      is_critical_interval: in_crit
    });
  }
  return depths;
};
