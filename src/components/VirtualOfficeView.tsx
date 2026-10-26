/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgentDefinition, AgentId, AgentProcessingProgress, AgentStatus } from '../types/clinical';
import { AgentAvatar } from './AgentAvatar';

interface VirtualOfficeViewProps {
  agents: AgentDefinition[];
  selectedAgents: Set<AgentId>;
  agentProgress: Record<AgentId, AgentProcessingProgress>;
  isAnalyzing: boolean;
  onToggleAgent: (id: AgentId) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onInspectAgent: (agent: AgentDefinition) => void;
  onStartAnalysis: () => void;
  onNavigateToUpload: () => void;
  onNavigateToResults: (id?: AgentId) => void;
  onNavigateToExecutive: () => void;
  totalRecordsLoaded: number;
}

export const VirtualOfficeView: React.FC<VirtualOfficeViewProps> = ({
  agents,
  selectedAgents,
  agentProgress,
  isAnalyzing,
  onToggleAgent,
  onSelectAll,
  onClearSelection,
  onInspectAgent,
  onStartAnalysis,
  onNavigateToUpload,
  onNavigateToResults,
  onNavigateToExecutive,
  totalRecordsLoaded
}) => {
  // Activity breakdown counts
  const counts = {
    idle: 0,
    selected: 0,
    processing: 0,
    completed: 0,
    error: 0
  };

  agents.forEach(agent => {
    const prog = agentProgress[agent.id];
    const isSel = selectedAgents.has(agent.id);
    if (prog?.status === 'processing') counts.processing++;
    else if (prog?.status === 'completed') counts.completed++;
    else if (prog?.status === 'error') counts.error++;
    else if (isSel) counts.selected++;
    else counts.idle++;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero / Portal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            <span>Clinical Intelligence Wing</span>
            <span aria-hidden="true">·</span>
            <span>6 Specialized Agent Offices</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">Active Dataset: {totalRecordsLoaded} Patient Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
            Clinical AI Virtual Office Portal
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Six specialized AI agents operate from dedicated virtual clinical offices to analyze patient sentiment, triage grievances, detect AI hallucinations, monitor equity disparities, and synthesize executive healthcare strategy.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onNavigateToUpload}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Manage Dataset ({totalRecordsLoaded})
          </button>

          <button
            onClick={selectedAgents.size === agents.length ? onClearSelection : onSelectAll}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {selectedAgents.size === agents.length ? 'Deselect All' : 'Select All 6 Agents'}
          </button>

          <button
            onClick={onStartAnalysis}
            disabled={selectedAgents.size === 0 || isAnalyzing}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-xs ${
              selectedAgents.size === 0 || isAnalyzing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {isAnalyzing
              ? 'Agents Working...'
              : `Run Analysis (${selectedAgents.size} Selected)`}
          </button>
        </div>
      </div>

      {/* Shared Activity Overview Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Office Telemetry:</span>
            <span className="text-slate-500 font-mono tabular-nums">{agents.length} Total Units</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-mono tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Idle: {counts.idle}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Selected: {counts.selected}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Processing: {counts.processing}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Completed: {counts.completed}</span>
            </span>

            {counts.error > 0 && (
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Errors: {counts.error}</span>
              </span>
            )}
          </div>
        </div>

        {counts.completed > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToResults()}
              className="text-teal-700 font-semibold hover:underline"
            >
              Browse Agent Results →
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={onNavigateToExecutive}
              className="text-slate-900 font-semibold hover:underline"
            >
              Executive Summary →
            </button>
          </div>
        )}
      </div>

      {/* Six Virtual Office Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const progress = agentProgress[agent.id];
          const isSelected = selectedAgents.has(agent.id);
          const currentStatus: AgentStatus = progress?.status || (isSelected ? 'selected' : 'idle');
          const isWorking = currentStatus === 'processing';
          const isCompleted = currentStatus === 'completed';

          return (
            <div
              key={agent.id}
              className={`group relative bg-white rounded-xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isWorking
                  ? 'border-amber-400 ring-2 ring-amber-100'
                  : isSelected
                  ? 'border-teal-500 ring-1 ring-teal-200'
                  : isCompleted
                  ? 'border-emerald-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Virtual Office Room Banner / Header */}
              <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                    {agent.roomName}
                  </span>
                  <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    {agent.roomTheme.officeType}
                  </div>
                </div>

                {/* Status indicator pill (clean text) */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isWorking
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isSelected
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>

              {/* Office Interior: Room Visual Canvas with Avatar */}
              <div
                onClick={() => onInspectAgent(agent)}
                className="cursor-pointer relative p-6 flex flex-col items-center text-center bg-gradient-to-b from-slate-50/30 to-white hover:bg-slate-50/40 transition-colors"
                title="Click to enter office & inspect agent dossier"
              >
                {/* Office Decor Backdrop Elements */}
                <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
                  <div className="absolute top-2 left-3 w-16 h-8 border border-slate-200 rounded-sm bg-white/60" />
                  <div className="absolute top-2 right-3 w-10 h-10 border border-slate-200 rounded-full bg-white/60" />
                  <div className="absolute bottom-2 left-6 right-6 h-1 bg-slate-200 rounded-full" />
                </div>

                {/* Representative Animated Avatar */}
                <div className="relative mb-3">
                  <AgentAvatar
                    agentId={agent.id}
                    status={currentStatus}
                    size="xl"
                  />
                  {isWorking && (
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                      <span className="text-[9px] font-mono font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs animate-bounce">
                        Analyzing...
                      </span>
                    </div>
                  )}
                </div>

                {/* Agent Name & Clinical Title */}
                <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {agent.name}
                </h2>
                <p className="text-xs font-medium text-teal-800 mb-2">
                  {agent.title}
                </p>

                {/* Short Function Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed px-2">
                  {agent.shortDescription}
                </p>
              </div>

              {/* Live Progress Indicator when active */}
              {isWorking && progress && (
                <div className="px-5 py-2.5 bg-amber-50/60 border-t border-amber-200 text-xs">
                  <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-amber-900 mb-1">
                    <span className="truncate max-w-[200px]">{progress.currentStepName}</span>
                    <span className="font-bold">{progress.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                  {progress.latestFindingSnippet && (
                    <p className="text-[10px] text-amber-800 truncate mt-1">
                      {progress.latestFindingSnippet}
                    </p>
                  )}
                </div>
              )}

              {/* Completed state summary bar */}
              {isCompleted && (
                <div className="px-5 py-2 bg-emerald-50/70 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-medium">Analysis Completed</span>
                  <button
                    onClick={() => onNavigateToResults(agent.id)}
                    className="font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    View Output →
                  </button>
                </div>
              )}

              {/* Office Bottom Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleAgent(agent.id)}
                  disabled={isWorking}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-teal-700 text-white hover:bg-teal-800'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? '✓ Selected' : '+ Select Agent'}
                </button>

                <button
                  onClick={() => onInspectAgent(agent)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Office Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
