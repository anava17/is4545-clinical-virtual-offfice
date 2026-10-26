/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgentDefinition, AgentStatus } from '../types/clinical';
import { AgentAvatar } from './AgentAvatar';

interface AgentRoomModalProps {
  agent: AgentDefinition | null;
  status: AgentStatus;
  isSelected: boolean;
  onToggleSelect: (id: AgentDefinition['id']) => void;
  onClose: () => void;
  onNavigateToResults: (id: AgentDefinition['id']) => void;
  onNavigateToConfig: () => void;
  hasResults: boolean;
}

export const AgentRoomModal: React.FC<AgentRoomModalProps> = ({
  agent,
  status,
  isSelected,
  onToggleSelect,
  onClose,
  onNavigateToResults,
  onNavigateToConfig,
  hasResults
}) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with office styling */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <AgentAvatar agentId={agent.id} status={status} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  {agent.roomName}
                </span>
                <span className="text-slate-300">·</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  status === 'processing'
                    ? 'bg-amber-100 text-amber-800'
                    : status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'selected'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  Status: {status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{agent.name}</h3>
              <p className="text-xs font-medium text-slate-600">{agent.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Office setting details */}
          <div className="p-3.5 bg-slate-100/70 rounded-lg text-xs border border-slate-200">
            <span className="font-semibold text-slate-800">Virtual Environment:</span>{' '}
            <span className="text-slate-600">{agent.roomTheme.officeType} — Equipped with {agent.roomTheme.decorItem}.</span>
          </div>

          {/* Role */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Clinical Role & Mission
            </h4>
            <p className="text-slate-600 leading-relaxed">{agent.role}</p>
          </div>

          {/* PDF Functional Tasks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Analytical Tasks & Workflow Steps
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {agent.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">›</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Constraints & Safeguards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Operating Constraints & Responsible Use
            </h4>
            <div className="space-y-1 text-xs text-slate-500 bg-amber-50/70 p-3 rounded-lg border border-amber-200/60">
              {agent.constraints.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleSelect(agent.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isSelected
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {isSelected ? 'Deselect Agent' : 'Select for Analysis'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToConfig();
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Configure Options
            </button>

            {hasResults && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToResults(agent.id);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                View Agent Output
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
