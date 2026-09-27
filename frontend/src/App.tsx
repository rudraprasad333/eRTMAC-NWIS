import React, { useState, useEffect, useCallback } from 'react';
import { 
  Well, 
  NearbyWell, 
  SimilarWell, 
  Formation, 
  RiskPrediction, 
  ExplainabilityData, 
  HistoricalEvent, 
  DocumentItem, 
  AlertItem, 
  DepthRiskItem 
} from './types';
import { api } from './services/api';
import { 
  MOCK_ACTIVE_WELL, 
  MOCK_FORMATIONS, 
  MOCK_SIMILAR_WELLS, 
  MOCK_RISK_PREDICTION, 
  MOCK_EXPLAINABILITY, 
  MOCK_HISTORICAL_EVENTS, 
  MOCK_DOCUMENTS, 
  MOCK_ALERTS, 
  generateMockDepthProfile 
} from './data/mockData';

import { CinematicBackground } from './components/background/CinematicBackground';
import { Header } from './components/common/Header';
import { Sidebar, TabType } from './components/common/Sidebar';

import { OverviewPage } from './pages/OverviewPage';
import { LiveDrillingPage } from './pages/LiveDrillingPage';
import { OffsetWellsPage } from './pages/OffsetWellsPage';
import { WellIntelligencePage } from './pages/WellIntelligencePage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { DepthAnalysisPage } from './pages/DepthAnalysisPage';
import { KnowledgeAssistantPage } from './pages/KnowledgeAssistantPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DemoTourOverlay } from './components/demo/DemoTourOverlay';

export const App: React.FC = () => {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);

  // Core Drilling State
  const [activeWell, setActiveWell] = useState<Well>(MOCK_ACTIVE_WELL);
  const [currentDepth, setCurrentDepth] = useState<number>(2715.0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Data Store
  const [formations, setFormations] = useState<Formation[]>(MOCK_FORMATIONS);
  const [analogues, setAnalogues] = useState<SimilarWell[]>(MOCK_SIMILAR_WELLS);
  const [riskData, setRiskData] = useState<RiskPrediction>(MOCK_RISK_PREDICTION);
  const [explainability, setExplainability] = useState<ExplainabilityData>(MOCK_EXPLAINABILITY);
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalEvent[]>(MOCK_HISTORICAL_EVENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [depthRiskProfile, setDepthRiskProfile] = useState<DepthRiskItem[]>(generateMockDepthProfile());

  // Fetch initial data from backend API (with graceful fallback)
  useEffect(() => {
    const initData = async () => {
      try {
        const [
          wellRes,
          formsRes,
          similarRes,
          riskRes,
          explRes,
          eventsRes,
          docsRes,
          alertsRes,
          depthRes
        ] = await Promise.all([
          api.getWellById("OIL-W102"),
          api.getFormations(),
          api.getSimilarWells("OIL-W102"),
          api.getRiskStatus("OIL-W102"),
          api.getExplanation("OIL-W102", 2715.0),
          api.getEvents(),
          api.getDocuments(),
          api.getAlerts("OIL-W102"),
          api.getDepthProfile("OIL-W102")
        ]);

        if (wellRes) setActiveWell(wellRes);
        if (formsRes && formsRes.length) setFormations(formsRes);
        if (similarRes && similarRes.length) setAnalogues(similarRes);
        if (riskRes) setRiskData(riskRes);
        if (explRes) setExplainability(explRes);
        if (eventsRes && eventsRes.length) setHistoricalEvents(eventsRes);
        if (docsRes && docsRes.length) setDocuments(docsRes);
        if (alertsRes && alertsRes.length) setAlerts(alertsRes);
        if (depthRes && depthRes.length) setDepthRiskProfile(depthRes);
      } catch (err) {
        console.warn("Using offline mock drilling data fallback:", err);
      }
    };

    initData();
  }, []);

  const handleAcknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    api.acknowledgeAlert(id);
  }, []);

  const handleDocumentUploaded = useCallback((newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  }, []);

  const handleSelectAnalogue = useCallback((well: SimilarWell) => {
    setCurrentTab('intelligence');
  }, []);

  const handleAskAssistant = useCallback((prompt?: string) => {
    setCurrentTab('assistant');
  }, []);

  const unreadAlertCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col relative selection:bg-brand-blue/30 selection:text-brand-cyan">
      {/* 1. Cinematic Background Visual Layer */}
      <CinematicBackground />

      {/* 2. Top Header Navigation */}
      <Header
        activeWellId={activeWell.well_id}
        onSelectWell={(id) => {}}
        currentDepth={currentDepth}
        onRunDemo={() => setIsDemoOpen(true)}
        unreadAlertCount={unreadAlertCount}
        onNavigateAlerts={() => setCurrentTab('alerts')}
        isSimulating={isSimulating}
      />

      {/* 3. Main Workspace Area: Sidebar + Active Page */}
      <div className="flex-1 flex overflow-hidden z-10">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          unreadAlerts={unreadAlertCount}
        />

        {/* Scrollable Page Content Container */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && (
              <OverviewPage
                activeWell={activeWell}
                currentDepth={currentDepth}
                riskData={riskData}
                explainability={explainability}
                topAnalogues={analogues}
                historicalEvents={historicalEvents}
                alerts={alerts}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onSelectWell={handleSelectAnalogue}
                onAskAssistant={handleAskAssistant}
              />
            )}

            {currentTab === 'live' && (
              <LiveDrillingPage
                activeWell={activeWell}
                currentDepth={currentDepth}
                onUpdateDepth={(d) => setCurrentDepth(d)}
                alerts={alerts}
              />
            )}

            {currentTab === 'offset-wells' && (
              <OffsetWellsPage
                targetWell={activeWell}
                offsetWells={analogues}
                onSelectWell={handleSelectAnalogue}
              />
            )}

            {currentTab === 'intelligence' && (
              <WellIntelligencePage
                targetWell={activeWell}
                currentDepth={currentDepth}
                formations={formations}
                analogues={analogues}
                onAnaloguesUpdated={(updated) => setAnalogues(updated)}
              />
            )}

            {currentTab === 'risk' && (
              <RiskIntelligencePage
                riskData={riskData}
                explainability={explainability}
              />
            )}

            {currentTab === 'depth' && (
              <DepthAnalysisPage
                depthData={depthRiskProfile}
                formations={formations}
                currentDepth={currentDepth}
                events={historicalEvents}
              />
            )}

            {currentTab === 'assistant' && (
              <KnowledgeAssistantPage />
            )}

            {currentTab === 'documents' && (
              <DocumentsPage
                documents={documents}
                onDocumentUploaded={handleDocumentUploaded}
              />
            )}

            {currentTab === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage />
            )}
          </div>
        </main>
      </div>

      {/* 4. Automated 10-Stage Interactive Demo Tour Walkthrough */}
      <DemoTourOverlay
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
};

export default App;
