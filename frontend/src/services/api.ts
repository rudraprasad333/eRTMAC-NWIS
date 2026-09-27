import axios from 'axios';
import {
  Well,
  NearbyWell,
  SimilarWell,
  Formation,
  HistoricalEvent,
  RiskPrediction,
  DepthRiskItem,
  ExplainabilityData,
  AssistantQueryResponse,
  DocumentItem,
  AlertItem,
  SimulationState,
  DrillingParam
} from '../types';
import {
  MOCK_ACTIVE_WELL,
  MOCK_FORMATIONS,
  MOCK_SIMILAR_WELLS,
  MOCK_RISK_PREDICTION,
  MOCK_EXPLAINABILITY,
  MOCK_HISTORICAL_EVENTS,
  MOCK_ALERTS,
  MOCK_DOCUMENTS,
  generateMockDepthProfile
} from '../data/mockData';

const API_BASE = 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 3500,
});

export let isBackendConnected = true;

export const api = {
  // Wells
  async getWells(): Promise<Well[]> {
    try {
      const res = await client.get<Well[]>('/wells');
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return [MOCK_ACTIVE_WELL, ...MOCK_SIMILAR_WELLS];
    }
  },

  async getWellById(wellId: string): Promise<Well> {
    try {
      const res = await client.get<Well>(`/wells/${wellId}`);
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return wellId === "OIL-W102" ? MOCK_ACTIVE_WELL : (MOCK_SIMILAR_WELLS.find(w => w.well_id === wellId) || MOCK_ACTIVE_WELL);
    }
  },

  async getNearbyWells(wellId: string = "OIL-W102", radiusKm: number = 25): Promise<NearbyWell[]> {
    try {
      const res = await client.get<NearbyWell[]>(`/wells/${wellId}/nearby`, { params: { radius_km: radiusKm } });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_SIMILAR_WELLS.map(w => ({
        ...w,
        risk_level: w.major_events_count >= 2 ? 'CRITICAL' : 'HIGH',
        event_count: w.major_events_count
      }));
    }
  },

  async getSimilarWells(wellId: string = "OIL-W102", weights?: Record<string, number>): Promise<SimilarWell[]> {
    try {
      const params: Record<string, any> = { limit: 10 };
      if (weights) {
        if (weights.geological !== undefined) params.w_geo = weights.geological;
        if (weights.spatial !== undefined) params.w_spat = weights.spatial;
        if (weights.depth !== undefined) params.w_dep = weights.depth;
        if (weights.formation !== undefined) params.w_form = weights.formation;
        if (weights.drilling_design !== undefined) params.w_des = weights.drilling_design;
        if (weights.historical_performance !== undefined) params.w_hist = weights.historical_performance;
      }
      const res = await client.get<SimilarWell[]>(`/wells/${wellId}/similar`, { params });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_SIMILAR_WELLS;
    }
  },

  async getFormations(): Promise<Formation[]> {
    try {
      const res = await client.get<Formation[]>('/wells/formations');
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_FORMATIONS;
    }
  },

  async getDrillingData(wellId: string = "OIL-W102"): Promise<DrillingParam[]> {
    try {
      const res = await client.get<DrillingParam[]>(`/wells/${wellId}/drilling-data`);
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return [];
    }
  },

  // Risk Intelligence
  async getRiskStatus(wellId: string = "OIL-W102"): Promise<RiskPrediction> {
    try {
      const res = await client.get<RiskPrediction>(`/risk/${wellId}`);
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_RISK_PREDICTION;
    }
  },

  async predictCustomRisk(payload: {
    well_id: string;
    current_depth: number;
    formation?: string;
    rop?: number;
    wob?: number;
    rpm?: number;
    torque?: number;
    mud_weight?: number;
    pressure?: number;
  }): Promise<RiskPrediction> {
    try {
      const res = await client.post<RiskPrediction>('/risk/predict', payload);
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      const factor = payload.current_depth >= 2700 && payload.current_depth <= 2800 ? 1.0 : 0.4;
      return {
        ...MOCK_RISK_PREDICTION,
        depth: payload.current_depth,
        stuck_pipe: { ...MOCK_RISK_PREDICTION.stuck_pipe, probability: Number(Math.min(0.95, (0.45 * factor) + (payload.torque || 20) * 0.015).toFixed(2)) }
      };
    }
  },

  async getDepthProfile(wellId: string = "OIL-W102"): Promise<DepthRiskItem[]> {
    try {
      const res = await client.get<DepthRiskItem[]>(`/risk/${wellId}/depth-profile`);
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return generateMockDepthProfile();
    }
  },

  async getExplanation(wellId: string = "OIL-W102", depth: number = 2715.0): Promise<ExplainabilityData> {
    try {
      const res = await client.get<ExplainabilityData>(`/risk/${wellId}/explanation`, { params: { depth } });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_EXPLAINABILITY;
    }
  },

  // Events
  async getEvents(params?: { event_type?: string; formation?: string; severity?: string }): Promise<HistoricalEvent[]> {
    try {
      const res = await client.get<HistoricalEvent[]>('/events', { params });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_HISTORICAL_EVENTS;
    }
  },

  // Knowledge Assistant RAG
  async queryAssistant(question: string, wellId: string = "OIL-W102", currentDepth: number = 2715.0): Promise<AssistantQueryResponse> {
    try {
      const res = await client.post<AssistantQueryResponse>('/assistant/query', {
        question,
        well_id: wellId,
        current_depth: currentDepth
      });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return {
        question,
        well_id: wellId,
        answer: "Three primary offset wells (OIL-W087, OIL-W091, and OIL-W074) experienced severe drilling challenges in the 2,700–2,800 m interval. Incidents include differential stuck pipe at 2,742 m (OIL-W087) requiring 4.2h of downward jarring, erratic torque spikes of 32 kft-lbs at 2,760 m (OIL-W091), and an 18-bbl gas kick at 2,710 m (OIL-W074). Mitigation: keep mud overbalance under 350 psi, limit static survey breaks to under 5 minutes, and dose 2% lubricant.",
        relevant_wells: ["OIL-W087", "OIL-W091", "OIL-W074"],
        historical_events: MOCK_HISTORICAL_EVENTS,
        evidence: [
          { well_id: "OIL-W087", depth: 2742, event_type: "Stuck Pipe", description: "Differentially stuck during 30-minute survey break. Spotted 45 bbl oil pill." },
          { well_id: "OIL-W091", depth: 2760, event_type: "High Torque", description: "Severe stick-slip and 32 kft-lbs torque. Wiper trip performed." },
          { well_id: "OIL-W074", depth: 2710, event_type: "Gas Influx Kick", description: "18 bbl pit gain with 320 psi shut-in pressure. Killed with 11.1 ppg mud." }
        ],
        confidence: 0.94,
        source_documents: ["OIL-W087_End_Of_Well_Report_EOWR.pdf", "OIL-W091_Daily_Drilling_Report_DDR_2760m.pdf", "OIL-W074_Incident_Investigation_Stuck_Pipe.pdf"]
      };
    }
  },

  // Documents
  async getDocuments(): Promise<DocumentItem[]> {
    try {
      const res = await client.get<DocumentItem[]>('/documents');
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_DOCUMENTS;
    }
  },

  async uploadDocument(file: File, wellId?: string, docType?: string): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (wellId) formData.append('well_id', wellId);
    if (docType) formData.append('document_type', docType);

    try {
      const res = await client.post<DocumentItem>('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return {
        id: Date.now(),
        filename: file.name,
        well_id: wellId || "OIL-W102",
        document_type: docType || "Daily Drilling Report",
        upload_date: new Date().toISOString(),
        extraction_status: "COMPLETED",
        indexed_status: "INDEXED",
        extracted_text: `Extracted content from ${file.name}. Parsed drilling parameters and lithological events.`,
        file_size_kb: Math.round(file.size / 1024) || 150
      };
    }
  },

  // Alerts & Simulation
  async getAlerts(wellId: string = "OIL-W102"): Promise<AlertItem[]> {
    try {
      const res = await client.get<AlertItem[]>('/simulation/alerts', { params: { well_id: wellId } });
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return MOCK_ALERTS;
    }
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      await client.post(`/simulation/alerts/${alertId}/acknowledge`);
    } catch {
      // offline silent acknowledge
    }
  },

  async getSimulationState(): Promise<SimulationState> {
    try {
      const res = await client.get<SimulationState>('/simulation/state');
      isBackendConnected = true;
      return res.data;
    } catch {
      isBackendConnected = false;
      return {
        is_running: false,
        speed: 1.0,
        current_depth: 2715.0,
        current_formation: "Fatehgarh Lower (Glauconitic Sandstone)",
        rop: 14.2,
        wob: 18.5,
        rpm: 110.0,
        torque: 24.8,
        mud_weight: 10.8,
        standpipe_pressure: 3450.0,
        active_alerts: MOCK_ALERTS,
        in_critical_zone: true
      };
    }
  },

  async stepSimulation(deltaM: number = 2.5): Promise<SimulationState> {
    try {
      const res = await client.post<SimulationState>('/simulation/step', null, { params: { delta_m: deltaM } });
      isBackendConnected = true;
      return res.data;
    } catch {
      return this.getSimulationState();
    }
  },

  async resetSimulation(depth: number = 2715.0): Promise<SimulationState> {
    try {
      const res = await client.post<SimulationState>('/simulation/reset', null, { params: { target_depth: depth } });
      isBackendConnected = true;
      return res.data;
    } catch {
      return this.getSimulationState();
    }
  }
};
