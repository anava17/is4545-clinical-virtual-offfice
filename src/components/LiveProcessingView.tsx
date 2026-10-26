/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgentDefinition, AgentId, AgentProcessingProgress } from '../types/clinical';
import { AgentAvatar } from './AgentAvatar';

interface LiveProcessingViewProps {
  agents: AgentDefinition[];
  selectedAgents: Set<AgentId>;
  agentProgress: Record<AgentId, AgentProcessingProgress>;
  isAnalyzing: boolean;
  onCancelAgent: (id: AgentId) => void;
  onRerunAgent: (id: AgentId) => void;
  onCancelAll: () => void;
  onRerunAll: () => void;
  onNavigateToResults: (id?: AgentId) => void;
  onNavigateToExecutive: () => void;
}

export const LiveProcessingView: React.FC<LiveProcessingViewProps> = ({
  agents,
  selectedAgents,
  agentProgress,
  isAnalyzing,
  onCancelAgent,
  onRerunAgent,
  onCancelAll,
  onRerunAll,
  onNavigateToResults,
  onNavigateToExecutive
}) => {
  // Only display agents that were selected or have progress
  const activeAgentList = agents.filter(
    (a) => selectedAgents.has(a.id) || agentProgress[a.id]?.status !== 'idle'
  );

  const completedCount = activeAgentList.filter(
    (a) => agentProgress[a.id]?.status === 'completed'
  ).length;

  const allCompleted = activeAgentList.length > 0 && completedCount === activeAgentList.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title & Global Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            <span>Multi-Agent Parallel Execution</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {completedCount} of {activeAgentList.length} Completed
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Live Workspace & Analytical Processing
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Active healthcare AI agents analyzing clinical narratives, grievance severity, and executive metrics concurrently.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isAnalyzing && (
            <button
              onClick={onCancelAll}
              className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              Cancel All Active
            </button>
          )}

          {!isAnalyzing && (
            <button
              onClick={onRerunAll}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Rerun Simultaneous Analysis
            </button>
          )}

          {allCompleted && (
            <>
              <button
                onClick={() => onNavigateToResults()}
                className="px-4 py-2 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
              >
                Inspect Agent Results
              </button>
              <button
                onClick={onNavigateToExecutive}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                View Executive Dashboard →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Parallel Execution Progress Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Parallel Pipeline Status:</span>
            <span className={isAnalyzing ? 'text-amber-800 font-semibold' : 'text-emerald-700 font-semibold'}>
              {isAnalyzing ? 'Concurrent Streams Active' : allCompleted ? 'All Agents Complete' : 'Ready'}
            </span>
          </div>
          <span className="font-mono tabular-nums text-slate-500">
            {Math.round(
              activeAgentList.reduce(
                (acc, a) => acc + (agentProgress[a.id]?.progressPercent || 0),
                0
              ) / (activeAgentList.length || 1)
            )}
            % Pipeline Velocity
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAnalyzing ? 'bg-amber-500' : 'bg-teal-600'
            }`}
            style={{
              width: `${Math.round(
                activeAgentList.reduce(
                  (acc, a) => acc + (agentProgress[a.id]?.progressPercent || 0),
                  0
                ) / (activeAgentList.length || 1)
              )}%`
            }}
          />
        </div>
      </div>

      {/* Grid of Agent Processing Offices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeAgentList.map((agent) => {
          const prog = agentProgress[agent.id] || {
            agentId: agent.id,
            status: 'idle',
            progressPercent: 0,
            currentStepIndex: 0,
            currentStepName: 'Awaiting launch...',
            totalSteps: agent.tasks.length,
            logs: [],
            latestFindingSnippet: 'Ready for analysis.'
          };

          const isWorking = prog.status === 'processing';
          const isDone = prog.status === 'completed';

          return (
            <div
              key={agent.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs transition-all flex flex-col justify-between ${
                isWorking
                  ? 'border-amber-400 ring-2 ring-amber-100'
                  : isDone
                  ? 'border-emerald-300'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Agent Header with Animated Avatar */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <AgentAvatar
                      agentId={agent.id}
                      status={prog.status}
                      size="lg"
                    />
                    <div>
                      <div className="text-[11px] font-bold uppercase text-teal-800">
                        {agent.roomName}
                      </div>
                      <h2 className="text-base font-bold text-slate-900">{agent.name}</h2>
                      <p className="text-xs text-slate-500">{agent.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isWorking ? (
                      <button
                        onClick={() => onCancelAgent(agent.id)}
                        className="text-xs px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-md font-medium border border-rose-200 transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => onRerunAgent(agent.id)}
                        className="text-xs px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded-md font-medium border border-slate-200 transition-colors"
                      >
                        Rerun
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Current Analytical Step */}
                <div className="my-4">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums mb-1.5">
                    <span className="font-semibold text-slate-800 truncate max-w-[280px]">
                      {prog.currentStepName}
                    </span>
                    <span className="font-bold text-teal-800">
                      {prog.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isWorking
                          ? 'bg-amber-500'
                          : isDone
                          ? 'bg-emerald-600'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${prog.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Newly Generated Findings Preview */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">
                    Live Analytical Finding Snippet:
                  </span>
                  <p className="text-slate-600 italic">
                    "{prog.latestFindingSnippet || 'Synthesizing clinical signals...'}"
                  </p>
                </div>

                {/* Analytical Steps Log Stream */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Real-Time Analytical Log
                  </div>
                  <div className="bg-slate-900 text-slate-300 font-mono text-[11px] rounded-lg p-3 max-h-28 overflow-y-auto space-y-1">
                    {prog.logs.length === 0 ? (
                      <div className="text-slate-500">Pipeline initialized. Waiting for execution...</div>
                    ) : (
                      prog.logs.map((log, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2">
                          <span className="text-teal-400 shrink-0">[{log.timestamp}]</span>
                          <span className="text-slate-200">{log.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Stage {prog.currentStepIndex + 1} of {prog.totalSteps}
                </span>

                {isDone && (
                  <button
                    onClick={() => onNavigateToResults(agent.id)}
                    className="font-bold text-teal-700 hover:text-teal-900 underline"
                  >
                    Open Agent Report →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
