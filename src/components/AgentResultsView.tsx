/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AgentDefinition,
  AgentId,
  Agent1Result,
  Agent2Result,
  Agent3Result,
  Agent4Result,
  Agent5Result,
  Agent5AnalyticsResult,
  Agent6Result
} from '../types/clinical';
import { AgentAvatar } from './AgentAvatar';

interface AgentResultsViewProps {
  agents: AgentDefinition[];
  activeAgentId: AgentId;
  onSelectAgentTab: (id: AgentId) => void;
  results: {
    agent1?: Agent1Result;
    agent2?: Agent2Result;
    agent3?: Agent3Result;
    agent4?: Agent4Result;
    agent5?: Agent5Result;
    agent6?: Agent6Result;
  };
  onNavigateToExecutive: () => void;
  onNavigateToConfig: () => void;
}

export const AgentResultsView: React.FC<AgentResultsViewProps> = ({
  agents,
  activeAgentId,
  onSelectAgentTab,
  results,
  onNavigateToExecutive,
  onNavigateToConfig
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];
  const activeResult = results[activeAgentId];

  // Export current agent results as JSON or CSV
  const handleExportJSON = () => {
    if (!activeResult) return;
    const blob = new Blob([JSON.stringify(activeResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeAgent.id}_results_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            <span>Clinical Analytical Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>Independent Agent Workspaces</span>
            {activeResult && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-500 font-normal">
                  Completed: {new Date(activeResult.completedAt).toLocaleTimeString()}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Specialized Agent Results
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Examine in-depth, decision-oriented analytical outcomes produced by each specialized AI clinical agent.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeResult && (
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Export Agent JSON
            </button>
          )}

          <button
            onClick={onNavigateToExecutive}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            Combined Executive Summary →
          </button>
        </div>
      </div>

      {/* Six Agent Result Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {agents.map((agent) => {
          const hasData = !!results[agent.id];
          const isCurrent = agent.id === activeAgentId;

          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgentTab(agent.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AgentAvatar agentId={agent.id} status={hasData ? 'completed' : 'idle'} size="sm" showBadge={false} />
              <div className="text-left">
                <div className="text-[10px] text-teal-800 font-bold uppercase">{agent.roomName.split(' · ')[0]}</div>
                <div className="truncate max-w-[140px]">{agent.name}</div>
              </div>
              {hasData && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* If No Results Yet for this Agent */}
      {!activeResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-2xl mb-4">
            🔬
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            No Output Generated for {activeAgent.name} Yet
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            This agent has not completed analysis on the active patient dataset. You can configure and run this agent now.
          </p>
          <button
            onClick={onNavigateToConfig}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            Configure & Run {activeAgent.name} →
          </button>
        </div>
      )}

      {/* DEDICATED RESULTS FOR AGENT 1 */}
      {activeResult && activeAgentId === 'agent1' && (
        <Agent1View
          result={activeResult as Agent1Result}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          expandedItemId={expandedItemId}
          setExpandedItemId={setExpandedItemId}
        />
      )}

      {/* DEDICATED RESULTS FOR AGENT 2 */}
      {activeResult && activeAgentId === 'agent2' && (
        <Agent2View
          result={activeResult as Agent2Result}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expandedItemId={expandedItemId}
          setExpandedItemId={setExpandedItemId}
        />
      )}

      {/* DEDICATED RESULTS FOR AGENT 3 */}
      {activeResult && activeAgentId === 'agent3' && (
        <Agent3View
          result={activeResult as Agent3Result}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expandedItemId={expandedItemId}
          setExpandedItemId={setExpandedItemId}
        />
      )}

      {/* DEDICATED RESULTS FOR AGENT 4 */}
      {activeResult && activeAgentId === 'agent4' && (
        <Agent4View
          result={activeResult as Agent4Result}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expandedItemId={expandedItemId}
          setExpandedItemId={setExpandedItemId}
        />
      )}

      {/* DEDICATED RESULTS FOR AGENT 5 */}
      {activeResult && activeAgentId === 'agent5' && (
        <Agent5View result={activeResult as Agent5AnalyticsResult} />
      )}

      {/* DEDICATED RESULTS FOR AGENT 6 */}
      {activeResult && activeAgentId === 'agent6' && (
        <Agent6View result={activeResult as Agent6Result} />
      )}
    </div>
  );
};

// ---------------- AGENT 1 COMPONENT ----------------
function Agent1View({
  result,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  expandedItemId,
  setExpandedItemId
}: {
  result: Agent1Result;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedFilter: string;
  setSelectedFilter: (s: string) => void;
  expandedItemId: string | null;
  setExpandedItemId: (id: string | null) => void;
}) {
  const filteredItems = result.items.filter(item => {
    const matchesSearch =
      item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operationalIssue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.theme === selectedFilter || item.sentiment === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards: Theme & Sentiment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Comments Processed</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">{result.items.length}</div>
          <div className="text-[11px] text-teal-700 mt-1">100% Theme Categorized</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Sentiment Profile</div>
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums mt-1.5">
            <span className="text-emerald-700 font-bold">Pos: {result.sentimentDistribution.Positive}</span>
            <span>·</span>
            <span className="text-rose-700 font-bold">Neg: {result.sentimentDistribution.Negative}</span>
            <span>·</span>
            <span className="text-slate-600">Mix: {result.sentimentDistribution.Mixed}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Neut: {result.sentimentDistribution.Neutral}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs col-span-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Top Themes Identified</div>
          <div className="flex items-center gap-3 flex-wrap mt-2">
            {Object.entries(result.themeDistribution).map(([theme, count]) => (
              count > 0 && (
                <button
                  key={theme}
                  onClick={() => setSelectedFilter(selectedFilter === theme ? 'all' : theme)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-colors ${
                    selectedFilter === theme
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {theme}: <span className="font-mono font-bold">{count}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Key Risks & Operational Issues Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs">
          <div className="font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
            <span>⚠</span>
            <span>Critical Patient Safety & Equity Flags</span>
          </div>
          <ul className="space-y-1 text-amber-800">
            {result.keyRisksIdentified.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">›</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
          <div className="font-bold text-slate-900 mb-1.5">
            Systemic Healthcare Process Bottlenecks
          </div>
          <ul className="space-y-1 text-slate-700">
            {result.topOperationalIssues.map((op, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-teal-600">›</span>
                <span>{op}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filterable Patient Comment Detailed Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search narrative, issue, or ID..."
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {selectedFilter !== 'all' && (
              <button
                onClick={() => setSelectedFilter('all')}
                className="text-xs text-teal-700 underline"
              >
                Clear filter ({selectedFilter})
              </button>
            )}
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            Showing {filteredItems.length} items
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.patient_id;

            return (
              <div key={item.patient_id} className="p-4 hover:bg-slate-50/60 transition-colors text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">{item.patient_id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-800">{item.theme}</span>
                    <span className="text-slate-300">·</span>
                    <span className={`font-semibold ${
                      item.sentiment === 'Positive' ? 'text-emerald-700' :
                      item.sentiment === 'Negative' ? 'text-rose-700' :
                      item.sentiment === 'Mixed' ? 'text-amber-800' : 'text-slate-500'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.patient_id)}
                    className="text-teal-700 font-semibold hover:underline text-left sm:text-right"
                  >
                    {isExpanded ? 'Hide Analytical Steps ▲' : 'View Steps 1–6 ▼'}
                  </button>
                </div>

                <p className="text-slate-600 mt-2 italic leading-relaxed">
                  "{item.comment}"
                </p>

                {/* Expanded Steps 1–6 View */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3 rounded-lg">
                    <div>
                      <span className="font-bold text-slate-800 block mb-0.5">Step 3. Reasoning:</span>
                      <p className="text-slate-600">{item.reasoning}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 block mb-0.5">Step 4. Operational Issue:</span>
                      <p className="text-slate-600">{item.operationalIssue}</p>
                    </div>

                    <div>
                      <span className="font-bold text-amber-800 block mb-0.5">Step 5. Risk / Bias Concern:</span>
                      <p className="text-slate-600">{item.riskOrBiasConcern}</p>
                    </div>

                    <div>
                      <span className="font-bold text-teal-800 block mb-0.5">Step 6. Recommended Action:</span>
                      <p className="text-slate-600">{item.recommendedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------- AGENT 2 COMPONENT ----------------
function Agent2View({
  result,
  searchTerm,
  setSearchTerm,
  expandedItemId,
  setExpandedItemId
}: {
  result: Agent2Result;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  expandedItemId: string | null;
  setExpandedItemId: (id: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Multi-Dimensional Risk Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Patient Safety High Risk</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 mt-1">
            {result.overallRiskProfile.patientSafetyHigh} Cases
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct clinical harm exposure</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Equity Disparity High Risk</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 mt-1">
            {result.overallRiskProfile.equityHigh} Cases
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Vulnerable demographic impact</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Compliance High Risk</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 mt-1">
            {result.overallRiskProfile.complianceHigh} Cases
          </div>
          <div className="text-[11px] text-slate-500 mt-1">ADA / Title VI regulatory concern</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Reputational High Risk</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-800 mt-1">
            {result.overallRiskProfile.reputationalHigh} Cases
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Grievances & review backlash</div>
        </div>
      </div>

      {/* Equity & Accessibility Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Step 3: Healthcare Equity & Accessibility Review Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {result.equityRiskSummary.map((eq, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{eq.category}</span>
                <span className="font-mono font-bold text-teal-700">{eq.count} Incidents</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{eq.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Bottlenecks Ranking */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Step 2: Operational Bottlenecks Identified
        </h3>
        <div className="space-y-2 text-xs">
          {result.bottlenecksSummary.map((b, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">{b.issue}</span>
                <span className="text-slate-400 block text-[11px]">Primary severity: {b.severity}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                {b.count} Occurrences
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Case Details */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient experience cases..."
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {result.items
            .filter(item => item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) || item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => (
              <div key={item.patient_id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{item.patient_id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-medium text-slate-700">{item.primaryTheme}</span>
                    {item.equityAndAccessibilityFlag.hasConcern && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        Equity: {item.equityAndAccessibilityFlag.demographicCategory}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Safety: {item.riskAssessment.patientSafety} · Compliance: {item.riskAssessment.compliance}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 italic">"{item.comment}"</p>
                <div className="mt-2 text-teal-800 font-medium">
                  Recommendation: {item.managerialRecommendation}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- AGENT 3 COMPONENT ----------------
function Agent3View({
  result,
  searchTerm,
  setSearchTerm,
  expandedItemId,
  setExpandedItemId
}: {
  result: Agent3Result;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  expandedItemId: string | null;
  setExpandedItemId: (id: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Acuity Breakdown Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Level 4 · Critical</div>
          <div className="text-2xl font-mono font-bold text-rose-900 mt-1">{result.severityBreakdown.critical} Cases</div>
          <div className="text-[11px] text-rose-700 mt-1">Immediate (Within 2 Hours)</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Level 3 · High</div>
          <div className="text-2xl font-mono font-bold text-amber-900 mt-1">{result.severityBreakdown.high} Cases</div>
          <div className="text-[11px] text-amber-700 mt-1">Urgent (Within 12 Hours)</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Level 2 · Moderate</div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">{result.severityBreakdown.moderate} Cases</div>
          <div className="text-[11px] text-slate-600 mt-1">Standard (Within 24 Hours)</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Level 1 · Low</div>
          <div className="text-2xl font-mono font-bold text-emerald-900 mt-1">{result.severityBreakdown.low} Cases</div>
          <div className="text-[11px] text-emerald-700 mt-1">Routine Dissatisfaction</div>
        </div>
      </div>

      {/* Escalation Routing Distribution */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Step 4: Clinical & Administrative Escalation Destinations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
          {Object.entries(result.routingDistribution).map(([dept, count]) => (
            <div key={dept} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block truncate">{dept}</span>
              <span className="font-mono text-teal-700 font-bold mt-1 block">{count} Routed</span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Attention Callout */}
      {result.criticalAttentionItems.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-5">
          <h3 className="text-sm font-bold text-rose-900 mb-2 flex items-center gap-2">
            <span>🚨</span>
            <span>Immediate Triage Dispatch Queue ({result.criticalAttentionItems.length} Cases)</span>
          </h3>
          <div className="space-y-3 text-xs">
            {result.criticalAttentionItems.map((item) => (
              <div key={item.patient_id} className="p-3.5 bg-white rounded-lg border border-rose-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-900">{item.patient_id}</span>
                  <span className="font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                    ROUTE TO: {item.escalationRoute}
                  </span>
                </div>
                <p className="text-slate-700 mt-1 italic">"{item.comment}"</p>
                <div className="mt-2 text-rose-900 font-medium">
                  {item.severityReasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triage Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search triage queue..."
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {result.items
            .filter(item => item.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) || item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(item => (
              <div key={item.patient_id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{item.patient_id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-medium text-slate-800">{item.primaryCategory}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-600">{item.severityLevel}</span>
                  </div>
                  <span className="font-mono text-teal-800 font-semibold">{item.escalationRoute}</span>
                </div>
                <p className="text-slate-600 mt-1 italic">"{item.comment}"</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- AGENT 4 COMPONENT ----------------
function Agent4View({
  result,
  searchTerm,
  setSearchTerm,
  expandedItemId,
  setExpandedItemId
}: {
  result: Agent4Result;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  expandedItemId: string | null;
  setExpandedItemId: (id: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Top of Dashboard Alert Banner (Authoritative Requirement) */}
      <div className="p-5 bg-amber-500/10 border border-amber-300 rounded-xl flex items-start gap-3.5">
        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          !
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-0.5">
            Top Hospital Management Alert
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {result.topManagementAlert}
          </p>
        </div>
      </div>

      {/* Priority Breakdown & Human Review Count */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">High Priority Management</div>
          <div className="text-2xl font-mono font-bold text-rose-700 mt-1">{result.priorityBreakdown.High} Cases</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires immediate executive oversight</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Medium Priority</div>
          <div className="text-2xl font-mono font-bold text-amber-700 mt-1">{result.priorityBreakdown.Medium} Cases</div>
          <div className="text-[11px] text-slate-400 mt-1">Operational revision needed</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Low Priority</div>
          <div className="text-2xl font-mono font-bold text-slate-700 mt-1">{result.priorityBreakdown.Low} Cases</div>
          <div className="text-[11px] text-slate-400 mt-1">Standard workflow</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Human Review Triggered</div>
          <div className="text-2xl font-mono font-bold text-teal-800 mt-1">{result.humanReviewCount} Cases</div>
          <div className="text-[11px] text-teal-700 mt-1">Clinical sign-off required</div>
        </div>
      </div>

      {/* Case Analysis Cards */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cases by ID or service line..."
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {result.cases
            .filter(c => c.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) || c.service_line.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(c => (
              <div key={c.patient_id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{c.patient_id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-800">{c.service_line}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{c.persona}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    c.managementPriority === 'High' ? 'bg-rose-100 text-rose-800' :
                    c.managementPriority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    Priority: {c.managementPriority}
                  </span>
                </div>

                <div className="mt-2 text-slate-700 font-medium">
                  Problem: {c.mainProblem}
                </div>

                {c.aiRiskFlagAssessment && (
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
                    <span className="font-bold">AI Risk Assessment:</span> {c.aiRiskFlagAssessment.details}
                    {c.aiRiskFlagAssessment.hallucinationWarning && (
                      <div className="text-rose-700 font-bold mt-0.5">
                        {c.aiRiskFlagAssessment.hallucinationWarning}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2 text-slate-500">
                  <span className="font-semibold text-slate-700">Actions:</span> {c.recommendedActions.join(' · ')}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom of Dashboard Recommended Actions (Authoritative Requirement) */}
      <div className="p-5 bg-slate-900 text-slate-100 rounded-xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
          Executive Operational Directives (Bottom Summary)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {result.bottomRecommendedActions.map((act, idx) => (
            <div key={idx} className="p-3 bg-slate-800 rounded-lg border border-slate-700 leading-relaxed">
              <span className="text-teal-400 font-bold block mb-1">Directive {idx + 1}:</span>
              <p className="text-slate-300">{act}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- AGENT 5 COMPONENT ----------------
function Agent5View({ result }: { result: Agent5AnalyticsResult }) {
  return (
    <div className="space-y-8">
      {/* SECTION 1: Executive Overview */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-3">
          Section 1: Executive Overview KPIs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-slate-500 text-[11px]">Total Comments</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{result.section1_executiveOverview.totalCommentsAnalyzed}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-slate-500 text-[11px]">Avg Satisfaction</div>
            <div className="text-2xl font-bold font-mono text-teal-700 mt-1">{result.section1_executiveOverview.avgPatientSatisfaction} / 5.0</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-slate-500 text-[11px]">Avg Communication</div>
            <div className="text-2xl font-bold font-mono text-indigo-700 mt-1">{result.section1_executiveOverview.avgCommunicationRating} / 5.0</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-slate-500 text-[11px]">Follow-Up Compliance</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{result.section1_executiveOverview.followUpComplianceRate}%</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="text-slate-500 text-[11px]">Service Lines</div>
            <div className="text-2xl font-bold font-mono text-slate-800 mt-1">{result.section1_executiveOverview.numberOfServiceLines} Units</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Patient Satisfaction Insights */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-3">
          Section 2: Patient Satisfaction Insights
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satisfaction by Service Line Bar Visualization */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Satisfaction by Service Line</h4>
            <div className="space-y-3 text-xs">
              {result.section2_satisfactionInsights.satisfactionByServiceLine.map((sl) => (
                <div key={sl.serviceLine}>
                  <div className="flex justify-between items-center text-slate-700 mb-1">
                    <span className="font-medium truncate max-w-[220px]">{sl.serviceLine}</span>
                    <span className="font-mono font-bold">{sl.avgScore} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${sl.avgScore >= 4 ? 'bg-emerald-500' : sl.avgScore >= 2.5 ? 'bg-teal-500' : 'bg-rose-500'}`}
                      style={{ width: `${(sl.avgScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction by Visit Type */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Satisfaction by Care Delivery Modality</h4>
            <div className="space-y-3 text-xs">
              {result.section2_satisfactionInsights.satisfactionByVisitType.map((vt) => (
                <div key={vt.visitType}>
                  <div className="flex justify-between items-center text-slate-700 mb-1">
                    <span className="font-medium">{vt.visitType}</span>
                    <span className="font-mono font-bold">{vt.avgScore} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${vt.avgScore >= 4 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${(vt.avgScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: NLP Analysis & Word Cloud */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-3">
          Section 3: NLP Linguistic Analysis & Interactive Word Cloud
        </h3>
        <div className="flex flex-wrap gap-2.5 items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
          {result.section3_nlpAnalysis.wordCloud.map((w, idx) => (
            <span
              key={idx}
              className={`font-semibold cursor-pointer transition-transform hover:scale-110 px-2 py-1 rounded-md ${
                w.sentiment === 'positive'
                  ? 'text-emerald-700 bg-emerald-50/80 border border-emerald-200'
                  : w.sentiment === 'negative'
                  ? 'text-rose-700 bg-rose-50/80 border border-rose-200'
                  : 'text-slate-700 bg-slate-200/80 border border-slate-300'
              }`}
              style={{ fontSize: `${Math.max(12, Math.min(22, w.value / 1.7))}px` }}
              title={`Frequency weight: ${w.value}`}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 4: Hidden Organizational Problems */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-3">
          Section 4: Hidden Organizational Problems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">Communication Bottlenecks:</span>
            <ul className="space-y-1 text-slate-600">
              {result.section4_hiddenOrganizationalProblems.communicationBottlenecks.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">Technology & Digital Access Issues:</span>
            <ul className="space-y-1 text-slate-600">
              {result.section4_hiddenOrganizationalProblems.technologyIssues.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 5: AI Risk Monitoring */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
          Section 5: AI Risk Monitoring (Hallucinations & Bias Traps)
        </h3>
        <div className="space-y-3 text-xs">
          {result.section5_aiRiskMonitoring.hallucinationTrapComments.map((h, i) => (
            <div key={i} className="p-3 bg-white rounded-lg border border-amber-200">
              <span className="font-mono font-bold text-rose-800">{h.patientId} · Hallucination Flag</span>
              <p className="text-slate-700 italic mt-0.5">"{h.comment}"</p>
              <div className="text-amber-800 font-semibold mt-1">Audit Note: {h.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Executive Recommendations */}
      <div className="p-5 bg-slate-900 text-slate-100 rounded-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
          Section 6: Executive Strategic Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-bold text-white block mb-1.5">Top 5 Organizational Priorities:</span>
            <ul className="space-y-1 text-slate-300">
              {result.section6_executiveRecommendations.top5OrganizationalPriorities.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-bold text-teal-300 block mb-1.5">Quick Wins (Within 3 Months):</span>
            <ul className="space-y-1 text-slate-300">
              {result.section6_executiveRecommendations.quickWins3Months.map((q, i) => (
                <li key={i}>• {q}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-bold text-indigo-300 block mb-1.5">AI Opportunities (6–12 Months):</span>
            <ul className="space-y-1 text-slate-300">
              {result.section6_executiveRecommendations.longTermAIOpportunities6To12Months.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- AGENT 6 COMPONENT ----------------
function Agent6View({ result }: { result: Agent6Result }) {
  return (
    <div className="space-y-6">
      {/* Top Level Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Estimated Annual Leakage</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 mt-1">
            {result.step2_costOfInefficiencyAndWaste.totalEstimatedLeakage}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Identified across billing, churn & missed visits</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Avoidable Readmission Risk</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 mt-1">
            $580,000 / yr
          </div>
          <div className="text-[11px] text-slate-400 mt-1">CMS value-based penalty exposure</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Patient Churn Valuation</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-800 mt-1">
            {result.step2_costOfInefficiencyAndWaste.patientChurnRiskValue}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">3-year lifetime margin at risk</div>
        </div>
      </div>

      {/* Step 1 & Step 3 Strategic Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
            Step 1: Strategic Impact & Revenue Risk
          </h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            {result.step1_strategicImpactAndRevenueRisk.revenueImpactSummary}
          </p>
          <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 border border-slate-100">
            <div><span className="font-semibold text-slate-800">HCAHPS Impact:</span> <span className="text-slate-600">{result.step1_strategicImpactAndRevenueRisk.hcahpsImpact}</span></div>
            <div><span className="font-semibold text-slate-800">Retention Risk:</span> <span className="text-slate-600">{result.step1_strategicImpactAndRevenueRisk.patientRetentionRisk}</span></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
            Step 3: Market & Competitive Positioning
          </h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            {result.step3_marketAndCompetitivePositioning.regionalBenchmarkComparison}
          </p>
          <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 border border-slate-100">
            <span className="font-semibold text-slate-800 block">Competitor Threats:</span>
            <ul className="space-y-0.5 text-slate-600">
              {result.step3_marketAndCompetitivePositioning.competitorThreats.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Step 6: Interactive 3x3 Decision Matrix (Ease vs Impact) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Step 6: Strategic Decision Matrix & ROI Prioritization
            </h3>
            <p className="text-xs text-slate-500">
              Categorized by Ease of Implementation vs. Financial & Strategic Impact
            </p>
          </div>
          <span className="text-xs font-mono text-teal-700 font-bold">McKinsey / BCG Style</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Quick Wins */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between font-bold text-emerald-900 mb-2">
              <span>QUICK WINS (High Impact · High Ease)</span>
              <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded">Priority 1</span>
            </div>
            <div className="space-y-3">
              {result.step6_decisionMatrix.quadrants.highImpact_highEase.map(rec => (
                <div key={rec.id} className="p-3 bg-white rounded-lg border border-emerald-100">
                  <div className="font-bold text-slate-900">{rec.title}</div>
                  <div className="text-[11px] text-teal-800 mt-0.5">ROI: {rec.expectedROI}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Timeline: {rec.timeline} · {rec.resourceRequirements}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Bets */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <div className="flex items-center justify-between font-bold text-indigo-900 mb-2">
              <span>STRATEGIC BETS (High Impact · Lower Ease)</span>
              <span className="text-[10px] bg-indigo-200/80 px-2 py-0.5 rounded">Priority 2</span>
            </div>
            <div className="space-y-3">
              {result.step6_decisionMatrix.quadrants.highImpact_lowEase.map(rec => (
                <div key={rec.id} className="p-3 bg-white rounded-lg border border-indigo-100">
                  <div className="font-bold text-slate-900">{rec.title}</div>
                  <div className="text-[11px] text-indigo-700 mt-0.5">ROI: {rec.expectedROI}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Timeline: {rec.timeline} · {rec.resourceRequirements}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 5: Business Development Proposals */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
          Step 5: Business Development & Advisory Pitch Concept
        </h3>
        <p className="text-slate-300 leading-relaxed mb-3">
          {result.step5_businessDevelopmentAndProposals.proposalDraftConcept}
        </p>
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-teal-300">
          <span className="font-bold block mb-1">Strategic Joint Venture Pitch:</span>
          {result.step5_businessDevelopmentAndProposals.strategicPartnershipPitch}
        </div>
      </div>
    </div>
  );
}
