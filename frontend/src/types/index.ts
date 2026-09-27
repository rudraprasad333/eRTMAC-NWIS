export type RiskSeverity = 'LOW' | 'MEDIUM' | 'MEDIUM_HIGH' | 'HIGH' | 'CRITICAL';

export interface Well {
  id: number;
  well_id: string;
  latitude: number;
  longitude: number;
  field_name: string;
  formation: string;
  lithology: string;
  total_depth: number;
  well_type: string;
  spud_date?: string;
  completion_date?: string;
  pressure?: number;
  temperature?: number;
  status: string;
  trajectory_type: string;
  target_reservoir: string;
}

export interface NearbyWell extends Well {
  distance_km: number;
  bearing_deg?: number;
  risk_level: RiskSeverity;
  event_count: number;
}

export interface SimilarWell extends Well {
  distance_km: number;
  bearing_deg?: number;
  geological_similarity: number;
  spatial_similarity: number;
  depth_similarity: number;
  formation_similarity: number;
  drilling_design_similarity: number;
  historical_performance: number;
  operational_similarity: number;
  overall_similarity: number;
  key_risks: string[];
  major_events_count: number;
}

export interface DrillingParam {
  depth: number;
  rop: number;
  wob: number;
  rpm: number;
  torque: number;
  mud_weight: number;
  flow_rate: number;
  standpipe_pressure: number;
  hook_load: number;
  timestamp?: string;
}

export interface HistoricalEvent {
  id: number;
  well_id: string;
  depth: number;
  event_type: string;
  severity: RiskSeverity;
  description: string;
  duration: number;
  npt_hours: number;
  formation: string;
  mitigation?: string;
  timestamp?: string;
}

export interface Formation {
  id: number;
  formation_name: string;
  top_depth: number;
  bottom_depth: number;
  lithology: string;
  pressure_regime: string;
  risk_characteristics?: string;
  color_code: string;
}

export interface RiskItem {
  probability: number;
  severity: RiskSeverity;
  confidence: number;
  historical_frequency?: number;
  analogous_incidents?: number;
}

export interface RiskPrediction {
  well_id: string;
  depth: number;
  formation: string;
  stuck_pipe: RiskItem;
  lost_circulation: RiskItem;
  kick: RiskItem;
  high_torque: RiskItem;
  npt: RiskItem;
  timestamp?: string;
}

export interface DepthRiskItem {
  depth: number;
  formation: string;
  stuck_pipe: number;
  lost_circulation: number;
  kick: number;
  high_torque: number;
  npt: number;
  is_critical_interval: boolean;
}

export interface AnalogousWellSummary {
  well_id: string;
  similarity: string;
  event: string;
  depth: string;
  impact: string;
  resolution: string;
}

export interface ExplainabilityData {
  well_id: string;
  depth: number;
  formation: string;
  risk_type: string;
  probability: number;
  confidence: number;
  evidence: string[];
  contributing_factors: Record<string, number>;
  analogous_wells: AnalogousWellSummary[];
  recommended_mitigation_checks: string[];
}

export interface EvidenceSource {
  well_id: string;
  depth: number;
  event_type: string;
  description: string;
  document_ref?: string;
}

export interface AssistantQueryResponse {
  question: string;
  well_id: string;
  answer: string;
  relevant_wells: string[];
  historical_events: HistoricalEvent[];
  evidence: EvidenceSource[];
  confidence: number;
  source_documents: string[];
}

export interface DocumentItem {
  id: number;
  filename: string;
  well_id?: string;
  document_type: string;
  upload_date: string;
  extraction_status: string;
  indexed_status: string;
  extracted_text?: string;
  file_size_kb: number;
}

export interface AlertItem {
  id: string;
  well_id: string;
  depth: number;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  risk_zone: string;
  similar_wells_count: number;
  timestamp: string;
  acknowledged: boolean;
  action_suggestion: string;
}

export interface SimulationState {
  is_running: boolean;
  speed: number;
  current_depth: number;
  current_formation: string;
  rop: number;
  wob: number;
  rpm: number;
  torque: number;
  mud_weight: number;
  standpipe_pressure: number;
  active_alerts: AlertItem[];
  in_critical_zone: boolean;
}
