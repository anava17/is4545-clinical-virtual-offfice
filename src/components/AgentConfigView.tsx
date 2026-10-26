/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgentDefinition, AgentId } from '../types/clinical';
import { AgentAvatar } from './AgentAvatar';

export interface AgentConfigOptions {
  depth: 'rapid' | 'standard' | 'deep';
  focusArea: 'all' | 'safety' | 'equity' | 'throughput' | 'finance';
  escalationThreshold: 'all' | 'level2' | 'level3' | 'level4';
  modelEngine: 'deterministic' | 'gemini';
}

interface AgentConfigViewProps {
  agents: AgentDefinition[];
  selectedAgents: Set<AgentId>;
  onToggleAgent: (id: AgentId) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  configs: Record<AgentId, AgentConfigOptions>;
  onUpdateConfig: (id: AgentId, updates: Partial<AgentConfigOptions>) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
  totalRecordsLoaded: number;
}

export const AgentConfigView: React.FC<AgentConfigViewProps> = ({
  agents,
  selectedAgents,
  onToggleAgent,
  onSelectAll,
  onClearSelection,
  configs,
  onUpdateConfig,
  onStartAnalysis,
  isAnalyzing,
  totalRecordsLoaded
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title & Batch Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            Task Orchestration & Analytical Tuning
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Agent Task Configuration
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Select agents and fine-tune their analytical parameters, risk sensitivity thresholds, and focus domains before launching simultaneous processing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={selectedAgents.size === agents.length ? onClearSelection : onSelectAll}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {selectedAgents.size === agents.length ? 'Deselect All' : 'Select All 6 Agents'}
          </button>

          <button
            onClick={onStartAnalysis}
            disabled={selectedAgents.size === 0 || isAnalyzing}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors shadow-xs ${
              selectedAgents.size === 0 || isAnalyzing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {isAnalyzing
              ? 'Analysis Running...'
              : `Start Simultaneous Analysis (${selectedAgents.size} Agents)`}
          </button>
        </div>
      </div>

      {/* Cohort context alert */}
      <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-700">
        <span className="font-medium">
          Target Dataset: <span className="font-bold text-slate-900">{totalRecordsLoaded} De-identified Patient Records</span> across 7 Service Lines.
        </span>
        <span className="text-slate-500 font-mono tabular-nums">
          {selectedAgents.size} of {agents.length} Agents Enlisted
        </span>
      </div>

      {/* 6 Agent Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const isSelected = selectedAgents.has(agent.id);
          const config = configs[agent.id] || {
            depth: 'standard',
            focusArea: 'all',
            escalationThreshold: 'level3',
            modelEngine: 'deterministic'
          };

          return (
            <div
              key={agent.id}
              className={`bg-white rounded-xl border transition-all p-5 shadow-2xs flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 ring-1 ring-teal-200'
                  : 'border-slate-200 opacity-80'
              }`}
            >
              {/* Header with avatar & toggle */}
              <div>
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <AgentAvatar
                      agentId={agent.id}
                      status={isSelected ? 'selected' : 'idle'}
                      size="md"
                    />
                    <div>
                      <div className="text-[11px] font-bold uppercase text-teal-800">
                        {agent.roomName}
                      </div>
                      <h2 className="text-base font-bold text-slate-900">{agent.name}</h2>
                      <p className="text-xs text-slate-500">{agent.title}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleAgent(agent.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-teal-700 text-white hover:bg-teal-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ Active' : '+ Include'}
                  </button>
                </div>

                {/* Primary functions summary */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {agent.role}
                </p>

                {/* Analytical Options */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 text-xs">
                  {/* Analysis Depth */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Analytical Depth:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['rapid', 'standard', 'deep'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => onUpdateConfig(agent.id, { depth: d })}
                          className={`py-1.5 px-2 rounded-md font-medium capitalize text-center transition-colors text-[11px] ${
                            config.depth === d
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Focus Area */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Priority Focus Area:
                    </label>
                    <select
                      value={config.focusArea}
                      onChange={(e) =>
                        onUpdateConfig(agent.id, { focusArea: e.target.value as any })
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="all">Holistic Quality & Comprehensive Scope</option>
                      <option value="safety">Patient Safety & Clinical Harm Interception</option>
                      <option value="equity">Demographic Equity & Language Access</option>
                      <option value="throughput">Operational Throughput & Wait Bottlenecks</option>
                      <option value="finance">Revenue Cycle Leakage & Strategic ROI</option>
                    </select>
                  </div>

                  {/* Escalation Threshold */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Escalation Flagging Threshold:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                      {(
                        [
                          { key: 'all', label: 'All Levels' },
                          { key: 'level2', label: 'Level 2+' },
                          { key: 'level3', label: 'Level 3+' },
                          { key: 'level4', label: 'Critical Only' }
                        ] as const
                      ).map((lvl) => (
                        <button
                          key={lvl.key}
                          type="button"
                          onClick={() =>
                            onUpdateConfig(agent.id, { escalationThreshold: lvl.key })
                          }
                          className={`py-1 px-1.5 rounded-md font-medium text-center transition-colors truncate ${
                            config.escalationThreshold === lvl.key
                              ? 'bg-teal-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Tasks checklist */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{agent.tasks.length} Analytical Steps Configured</span>
                <span className="font-mono text-teal-800">Prompt v4.2 Spec Ready</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
