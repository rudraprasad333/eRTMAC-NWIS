from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- WELL SCHEMAS ---
class WellBase(BaseModel):
    well_id: str
    latitude: float
    longitude: float
    field_name: str = "Barmer Basin Block-A"
    formation: str
    lithology: str
    total_depth: float
    well_type: str = "Deviated"
    spud_date: Optional[str] = None
    completion_date: Optional[str] = None
    pressure: Optional[float] = None
    temperature: Optional[float] = None
    status: str = "Completed"
    trajectory_type: str = "S-Type"
    target_reservoir: str = "Fatehgarh Sandstone"

class WellOut(WellBase):
    id: int

    class Config:
        from_attributes = True

class NearbyWellOut(WellOut):
    distance_km: float
    bearing_deg: Optional[float] = None
    risk_level: str = "LOW"
    event_count: int = 0

class SimilarWellOut(WellOut):
    distance_km: float
    geological_similarity: float
    spatial_similarity: float
    depth_similarity: float
    formation_similarity: float
    drilling_design_similarity: float
    historical_performance: float
    overall_similarity: float
    key_risks: List[str] = []
    major_events_count: int = 0

# --- DRILLING PARAMETERS ---
class DrillingParamOut(BaseModel):
    depth: float
    rop: float
    wob: float
    rpm: float
    torque: float
    mud_weight: float
    flow_rate: float
    standpipe_pressure: float
    hook_load: float
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- HISTORICAL EVENTS ---
class EventOut(BaseModel):
    id: int
    well_id: str
    depth: float
    event_type: str
    severity: str
    description: str
    duration: float
    npt_hours: float
    formation: str
    mitigation: Optional[str] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- FORMATIONS ---
class FormationOut(BaseModel):
    id: int
    formation_name: str
    top_depth: float
    bottom_depth: float
    lithology: str
    pressure_regime: str
    risk_characteristics: Optional[str] = None
    color_code: str = "#2F80ED"

    class Config:
        from_attributes = True

# --- RISK PREDICTIONS ---
class RiskPredictRequest(BaseModel):
    well_id: str = "OIL-W102"
    current_depth: float = 2715.0
    formation: Optional[str] = "Fatehgarh Lower"
    rop: Optional[float] = 14.2
    wob: Optional[float] = 18.5
    rpm: Optional[float] = 110.0
    torque: Optional[float] = 24.8
    mud_weight: Optional[float] = 10.8
    pressure: Optional[float] = 3450.0

class RiskItem(BaseModel):
    probability: float
    severity: str # LOW, MEDIUM, MEDIUM_HIGH, HIGH, CRITICAL
    confidence: float
    historical_frequency: Optional[float] = None
    analogous_incidents: Optional[int] = None

class RiskPredictionResponse(BaseModel):
    well_id: str
    depth: float
    formation: str
    stuck_pipe: RiskItem
    lost_circulation: RiskItem
    kick: RiskItem
    high_torque: RiskItem
    npt: RiskItem
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DepthRiskItem(BaseModel):
    depth: float
    formation: str
    stuck_pipe: float
    lost_circulation: float
    kick: float
    high_torque: float
    npt: float
    is_critical_interval: bool = False

class ExplainabilityResponse(BaseModel):
    well_id: str
    depth: float
    formation: str
    risk_type: str
    probability: float
    confidence: float
    evidence: List[str]
    contributing_factors: Dict[str, float]
    analogous_wells: List[Dict[str, Any]]
    recommended_mitigation_checks: List[str]

# --- RAG ASSISTANT ---
class AssistantQueryRequest(BaseModel):
    well_id: str = "OIL-W102"
    question: str
    current_depth: Optional[float] = 2715.0

class EvidenceSource(BaseModel):
    well_id: str
    depth: float
    event_type: str
    description: str
    document_ref: Optional[str] = None

class AssistantQueryResponse(BaseModel):
    question: str
    well_id: str
    answer: str
    relevant_wells: List[str]
    historical_events: List[EventOut]
    evidence: List[EvidenceSource]
    confidence: float = 0.92
    source_documents: List[str]

# --- DOCUMENTS ---
class DocumentOut(BaseModel):
    id: int
    filename: str
    well_id: Optional[str] = None
    document_type: str
    upload_date: datetime
    extraction_status: str
    indexed_status: str
    extracted_text: Optional[str] = None
    extracted_events: Optional[str] = None
    file_size_kb: float

    class Config:
        from_attributes = True

# --- ALERTS & SIMULATION ---
class AlertItem(BaseModel):
    id: str
    well_id: str
    depth: float
    severity: str # INFO, WARNING, CRITICAL
    title: str
    message: str
    risk_zone: str
    similar_wells_count: int
    timestamp: str
    acknowledged: bool = False
    action_suggestion: str

class SimulationState(BaseModel):
    is_running: bool
    speed: float
    current_depth: float
    current_formation: str
    rop: float
    wob: float
    rpm: float
    torque: float
    mud_weight: float
    standpipe_pressure: float
    active_alerts: List[AlertItem]
    in_critical_zone: bool
