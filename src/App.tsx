/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  PatientRecord,
  AgentId,
  AgentDefinition,
  AgentProcessingProgress,
  Agent1Result,
  Agent2Result,
  Agent3Result,
  Agent4Result,
  Agent5Result,
  Agent5AnalyticsResult,
  Agent6Result,
  CombinedCrossAgentInsights,
  HumanReviewItem
} from './types/clinical';
import { AGENT_DEFINITIONS } from './data/agentDefinitions';
import { SAMPLE_PATIENT_DATASET } from './data/sampleDataset';
import {
  runAgent1Analysis,
  runAgent2Analysis,
  runAgent3Analysis,
  runAgent4Analysis,
  runAgent5Analysis,
  runAgent6Analysis,
  synthesizeCrossAgentInsights
} from './services/analysisEngine';
import { Header, ScreenType } from './components/Header';
import { VirtualOfficeView } from './components/VirtualOfficeView';
import { DataUploadView } from './components/DataUploadView';
import { AgentConfigView, AgentConfigOptions } from './components/AgentConfigView';
import { LiveProcessingView } from './components/LiveProcessingView';
import { AgentResultsView } from './components/AgentResultsView';
import { ExecutiveDashboardView } from './components/ExecutiveDashboardView';
import { AgentRoomModal } from './components/AgentRoomModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('office');
  const [dataset, setDataset] = useState<PatientRecord[]>(SAMPLE_PATIENT_DATASET);
  const [selectedAgents, setSelectedAgents] = useState<Set<AgentId>>(
    new Set(['agent1', 'agent2', 'agent3', 'agent4', 'agent5', 'agent6'])
  );

  // Per-agent configurations
  const [agentConfigs, setAgentConfigs] = useState<Record<AgentId, AgentConfigOptions>>({
    agent1: { depth: 'standard', focusArea: 'all', escalationThreshold: 'level3', modelEngine: 'deterministic' },
    agent2: { depth: 'standard', focusArea: 'equity', escalationThreshold: 'level3', modelEngine: 'deterministic' },
    agent3: { depth: 'deep', focusArea: 'safety', escalationThreshold: 'level2', modelEngine: 'deterministic' },
    agent4: { depth: 'standard', focusArea: 'all', escalationThreshold: 'level3', modelEngine: 'deterministic' },
    agent5: { depth: 'deep', focusArea: 'throughput', escalationThreshold: 'level3', modelEngine: 'deterministic' },
    agent6: { depth: 'standard', focusArea: 'finance', escalationThreshold: 'level3', modelEngine: 'deterministic' }
  });

  // Processing state per agent
  const [agentProgress, setAgentProgress] = useState<Record<AgentId, AgentProcessingProgress>>(() => {
    const initial: Record<string, AgentProcessingProgress> = {};
    AGENT_DEFINITIONS.forEach(a => {
      initial[a.id] = {
        agentId: a.id,
        status: 'idle',
        progressPercent: 0,
        currentStepIndex: 0,
        currentStepName: 'Idle in office',
        totalSteps: a.tasks.length,
        logs: [],
        latestFindingSnippet: 'Awaiting launch instruction.'
      };
    });
    return initial as Record<AgentId, AgentProcessingProgress>;
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Analysis outputs
  const [results, setResults] = useState<{
    agent1?: Agent1Result;
    agent2?: Agent2Result;
    agent3?: Agent3Result;
    agent4?: Agent4Result;
    agent5?: Agent5Result;
    agent6?: Agent6Result;
  }>({});

  const [combinedInsights, setCombinedInsights] = useState<CombinedCrossAgentInsights | undefined>(undefined);
  const [activeResultsTab, setActiveResultsTab] = useState<AgentId>('agent1');
  const [inspectedAgent, setInspectedAgent] = useState<AgentDefinition | null>(null);

  // Ref to cancel processing intervals if user interrupts
  const activeTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeTimersRef.current.forEach(t => clearInterval(t));
    };
  }, []);

  // Selection handlers
  const handleToggleAgent = (id: AgentId) => {
    setSelectedAgents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedAgents(new Set(AGENT_DEFINITIONS.map(a => a.id)));
  };

  const handleClearSelection = () => {
    setSelectedAgents(new Set());
  };

  const handleUpdateConfig = (id: AgentId, updates: Partial<AgentConfigOptions>) => {
    setAgentConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  // Launch parallel multi-agent analysis
  const startSimultaneousAnalysis = () => {
    if (selectedAgents.size === 0) return;

    // Clear previous timers
    activeTimersRef.current.forEach(t => clearInterval(t));
    activeTimersRef.current = [];

    setIsAnalyzing(true);
    setCurrentScreen('processing');

    // Initialize progress for selected agents
    const newProgress = { ...agentProgress };
    selectedAgents.forEach(id => {
      const agent = AGENT_DEFINITIONS.find(a => a.id === id);
      newProgress[id] = {
        agentId: id,
        status: 'processing',
        progressPercent: 10,
        currentStepIndex: 0,
        currentStepName: agent?.tasks[0] || 'Initiating clinical pipeline...',
        totalSteps: agent?.tasks.length || 5,
        logs: [
          {
            timestamp: new Date().toLocaleTimeString(),
            message: `Virtual office unlocked. Ingested ${dataset.length} clinical records.`,
            stepNumber: 1
          }
        ],
        latestFindingSnippet: 'Scanning patient cohort records...'
      };
    });
    setAgentProgress(newProgress);

    // Compute final results in background
    const final1 = selectedAgents.has('agent1') ? runAgent1Analysis(dataset) : undefined;
    const final2 = selectedAgents.has('agent2') ? runAgent2Analysis(dataset) : undefined;
    const final3 = selectedAgents.has('agent3') ? runAgent3Analysis(dataset) : undefined;
    const final4 = selectedAgents.has('agent4') ? runAgent4Analysis(dataset) : undefined;
    const final5 = selectedAgents.has('agent5') ? runAgent5Analysis(dataset) : undefined;
    const final6 = selectedAgents.has('agent6') ? runAgent6Analysis(dataset) : undefined;

    const findingSnippetsByAgent: Record<AgentId, string[]> = {
      agent1: [
        'Classifying theme: Emergency triage & discharge handoffs...',
        'Sentiment polarity calculated: 45% negative sentiment across wait times.',
        'Flagged operational friction: PT-1001 47-min telephony hold time.',
        'Identified language barrier risk: PT-1003 Spanish discharge packet.'
      ],
      agent2: [
        'Auditing equity demographics: Older adults & rural patient barriers...',
        'Bottleneck mapped: Weekend discharge pharmacy closures in ED.',
        'Risk matrix calculated: Patient safety high risk in 4 cases.',
        'ADA compliance gap flagged: PT-1016 ASL interpreter omission.'
      ],
      agent3: [
        'Evaluating acuity levels: Screening for Level 4 Critical cases...',
        'Critical triage flagged: PT-1020 55-min stroke evaluation delay.',
        'Routing dispatch generated: Risk Management & Nursing Leadership.',
        'Pharmacovigilance check: Flagged contraindicated NSAID in PT-1009.'
      ],
      agent4: [
        'Screening for AI EHR hallucinations and bias markers...',
        'Hallucination warning verified: PT-1009 CKD automated prescription note.',
        'Managerial priority ranked: 4 cases tagged for High Executive oversight.',
        'Directives generated: Bedside Meds-to-Beds delivery protocol.'
      ],
      agent5: [
        'Calculating C-suite overview KPIs: Satisfaction 2.75 / 5.0 baseline.',
        'Aggregating satisfaction by service line: Emergency Medicine lagging.',
        'NLP keyword cloud rendered: "Discharge", "Wait Time", "Interpreter".',
        'Top 5 organizational priorities synthesized for hospital leadership.'
      ],
      agent6: [
        'Quantifying financial leakage: $2.34M total inefficiency identified.',
        'HCAHPS value-based purchasing risk estimated at $580k CMS penalty.',
        'Constructing 3x3 ROI decision matrix: Meds-to-Beds categorized as Quick Win.',
        'Formulating consulting proposal: Project Elevate 12-week turnaround.'
      ]
    };

    let completedCounter = 0;
    const totalToRun = selectedAgents.size;

    Array.from(selectedAgents).forEach((agentId, index) => {
      const agent = AGENT_DEFINITIONS.find(a => a.id === agentId);
      const totalSteps = agent?.tasks.length || 5;
      let stepIndex = 0;

      // Staggered speed so agents complete realistically in parallel
      const stepDuration = 650 + (index * 120);

      const interval = setInterval(() => {
        stepIndex++;
        const percent = Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100));
        const snippetList = findingSnippetsByAgent[agentId];
        const snippet = snippetList[stepIndex % snippetList.length];
        const stepName = agent?.tasks[stepIndex] || 'Finalizing analytical report...';

        setAgentProgress(prev => {
          const current = prev[agentId];
          if (!current || current.status !== 'processing') return prev;

          const updatedLogs = [
            ...current.logs,
            {
              timestamp: new Date().toLocaleTimeString(),
              message: `${stepName.split(':')[0] || 'Step'}: Completed step iteration.`,
              stepNumber: stepIndex + 1
            }
          ];

          return {
            ...prev,
            [agentId]: {
              ...current,
              progressPercent: percent,
              currentStepIndex: stepIndex,
              currentStepName: stepName,
              logs: updatedLogs,
              latestFindingSnippet: snippet
            }
          };
        });

        if (stepIndex >= totalSteps - 1 || percent >= 100) {
          clearInterval(interval);
          completedCounter++;

          setAgentProgress(prev => ({
            ...prev,
            [agentId]: {
              ...prev[agentId],
              status: 'completed',
              progressPercent: 100,
              currentStepName: 'Analysis Complete',
              latestFindingSnippet: 'Full analytical outputs saved to dashboard.'
            }
          }));

          // When all finish
          if (completedCounter === totalToRun) {
            setIsAnalyzing(false);

            const newResults = {
              agent1: final1,
              agent2: final2,
              agent3: final3,
              agent4: final4,
              agent5: final5,
              agent6: final6
            };
            setResults(newResults);

            const cross = synthesizeCrossAgentInsights(dataset, newResults);
            setCombinedInsights(cross);
          }
        }
      }, stepDuration);

      activeTimersRef.current.push(interval);
    });
  };

  const cancelAgent = (id: AgentId) => {
    setAgentProgress(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: 'idle',
        progressPercent: 0,
        currentStepName: 'Cancelled by user',
        latestFindingSnippet: 'Run cancelled.'
      }
    }));
  };

  const cancelAll = () => {
    activeTimersRef.current.forEach(t => clearInterval(t));
    activeTimersRef.current = [];
    setIsAnalyzing(false);

    setAgentProgress(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        const id = k as AgentId;
        if (next[id].status === 'processing') {
          next[id] = {
            ...next[id],
            status: 'idle',
            progressPercent: 0,
            currentStepName: 'Cancelled by user'
          };
        }
      });
      return next;
    });
  };

  const rerunAgent = (id: AgentId) => {
    setSelectedAgents(new Set([id]));
    startSimultaneousAnalysis();
  };

  const handleUpdateHumanReviewItem = (updated: HumanReviewItem) => {
    if (!combinedInsights) return;
    setCombinedInsights(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        humanReviewQueue: prev.humanReviewQueue.map(item =>
          item.id === updated.id ? updated : item
        )
      };
    });
  };

  // Quick run on sample data immediately for first-time convenience
  const handleQuickRun = () => {
    setSelectedAgents(new Set(['agent1', 'agent2', 'agent3', 'agent4', 'agent5', 'agent6']));
    startSimultaneousAnalysis();
  };

  const hasAnyResults = Object.values(results).some(r => !!r);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      {/* 3-Zone Clean Top Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        selectedAgentCount={selectedAgents.size}
        isAnalyzing={isAnalyzing}
        hasResults={hasAnyResults}
        onQuickStart={handleQuickRun}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-16">
        {currentScreen === 'office' && (
          <VirtualOfficeView
            agents={AGENT_DEFINITIONS}
            selectedAgents={selectedAgents}
            agentProgress={agentProgress}
            isAnalyzing={isAnalyzing}
            onToggleAgent={handleToggleAgent}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onInspectAgent={(agent) => setInspectedAgent(agent)}
            onStartAnalysis={startSimultaneousAnalysis}
            onNavigateToUpload={() => setCurrentScreen('upload')}
            onNavigateToResults={(id) => {
              if (id) setActiveResultsTab(id);
              setCurrentScreen('results');
            }}
            onNavigateToExecutive={() => setCurrentScreen('executive')}
            totalRecordsLoaded={dataset.length}
          />
        )}

        {currentScreen === 'upload' && (
          <DataUploadView
            dataset={dataset}
            onUpdateDataset={(newRecords) => {
              setDataset(newRecords);
            }}
            onProceedToConfig={() => setCurrentScreen('config')}
          />
        )}

        {currentScreen === 'config' && (
          <AgentConfigView
            agents={AGENT_DEFINITIONS}
            selectedAgents={selectedAgents}
            onToggleAgent={handleToggleAgent}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            configs={agentConfigs}
            onUpdateConfig={handleUpdateConfig}
            onStartAnalysis={startSimultaneousAnalysis}
            isAnalyzing={isAnalyzing}
            totalRecordsLoaded={dataset.length}
          />
        )}

        {currentScreen === 'processing' && (
          <LiveProcessingView
            agents={AGENT_DEFINITIONS}
            selectedAgents={selectedAgents}
            agentProgress={agentProgress}
            isAnalyzing={isAnalyzing}
            onCancelAgent={cancelAgent}
            onRerunAgent={rerunAgent}
            onCancelAll={cancelAll}
            onRerunAll={startSimultaneousAnalysis}
            onNavigateToResults={(id) => {
              if (id) setActiveResultsTab(id);
              setCurrentScreen('results');
            }}
            onNavigateToExecutive={() => setCurrentScreen('executive')}
          />
        )}

        {currentScreen === 'results' && (
          <AgentResultsView
            agents={AGENT_DEFINITIONS}
            activeAgentId={activeResultsTab}
            onSelectAgentTab={setActiveResultsTab}
            results={results}
            onNavigateToExecutive={() => setCurrentScreen('executive')}
            onNavigateToConfig={() => setCurrentScreen('config')}
          />
        )}

        {currentScreen === 'executive' && (
          <ExecutiveDashboardView
            insights={combinedInsights}
            agents={AGENT_DEFINITIONS}
            onUpdateHumanReviewItem={handleUpdateHumanReviewItem}
            onNavigateToAgentResults={(id) => {
              setActiveResultsTab(id);
              setCurrentScreen('results');
            }}
            onNavigateToVirtualOffice={() => setCurrentScreen('office')}
          />
        )}
      </main>

      {/* Inspect Agent Room Modal */}
      <AgentRoomModal
        agent={inspectedAgent}
        status={inspectedAgent ? agentProgress[inspectedAgent.id]?.status || 'idle' : 'idle'}
        isSelected={inspectedAgent ? selectedAgents.has(inspectedAgent.id) : false}
        onToggleSelect={(id) => handleToggleAgent(id)}
        onClose={() => setInspectedAgent(null)}
        onNavigateToResults={(id) => {
          setActiveResultsTab(id);
          setCurrentScreen('results');
        }}
        onNavigateToConfig={() => setCurrentScreen('config')}
        hasResults={inspectedAgent ? !!results[inspectedAgent.id] : false}
      />
    </div>
  );
}
