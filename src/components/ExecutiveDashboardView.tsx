/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CombinedCrossAgentInsights,
  HumanReviewItem,
  AgentId,
  AgentDefinition
} from '../types/clinical';
import { AgentAvatar } from './AgentAvatar';

interface ExecutiveDashboardViewProps {
  insights?: CombinedCrossAgentInsights;
  agents: AgentDefinition[];
  onUpdateHumanReviewItem: (item: HumanReviewItem) => void;
  onNavigateToAgentResults: (agentId: AgentId) => void;
  onNavigateToVirtualOffice: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  insights,
  agents,
  onUpdateHumanReviewItem,
  onNavigateToAgentResults,
  onNavigateToVirtualOffice
}) => {
  const [activeReviewItem, setActiveReviewItem] = useState<HumanReviewItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewerName, setReviewerName] = useState('Dr. J. Reynolds, CMO');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Audited' | 'Overridden'>('all');

  if (!insights) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-12 max-w-lg mx-auto shadow-2xs">
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            No Executive Synthesis Available
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Run analysis across multiple agents to generate multi-agent corroborations, systemic patterns, and the human review queue.
          </p>
          <button
            onClick={onNavigateToVirtualOffice}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go to Virtual Offices to Start
          </button>
        </div>
      </div>
    );
  }

  const handleDecision = (newStatus: HumanReviewItem['status']) => {
    if (!activeReviewItem) return;
    const updated: HumanReviewItem = {
      ...activeReviewItem,
      status: newStatus,
      reviewedBy: reviewerName,
      reviewTimestamp: new Date().toLocaleString(),
      reviewNotes: reviewNote || `Decision recorded as ${newStatus} by ${reviewerName}.`
    };
    onUpdateHumanReviewItem(updated);
    setActiveReviewItem(updated);
  };

  const filteredQueue = insights.humanReviewQueue.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            <span>C-Suite & Clinical Governance Synthesis</span>
            <span aria-hidden="true">·</span>
            <span>Cross-Agent Corroboration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Combined Executive Dashboard & Human Review
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Synthesized intelligence from all active AI agents, systemic risk patterns, conflicting perspectives, and human oversight sign-off queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Print / Save PDF Report
          </button>
          <button
            onClick={onNavigateToVirtualOffice}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            Return to Virtual Offices
          </button>
        </div>
      </div>

      {/* Cross-Agent Corroborated Findings (Findings supported by 2+ agents) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Multi-Agent Corroborated Findings
            </h2>
            <p className="text-xs text-slate-500">
              High-confidence clinical and operational patterns independently validated by two or more specialized agents.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-700 font-bold">
            {insights.multiAgentCorroboratedFindings.length} Cross-Corroborations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.multiAgentCorroboratedFindings.map((finding, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-slate-900 text-sm">{finding.topic}</span>
                  <div className="flex items-center gap-1">
                    {finding.supportingAgents.map(agId => {
                      const ag = agents.find(a => a.id === agId);
                      return (
                        <button
                          key={agId}
                          onClick={() => onNavigateToAgentResults(agId)}
                          className="w-5 h-5 rounded-full bg-teal-600 text-white font-mono text-[9px] flex items-center justify-center hover:bg-teal-700 transition-colors"
                          title={`Corroborated by ${ag?.name || agId} (Click to inspect output)`}
                        >
                          {ag?.avatarStyle.initials || 'AI'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed mb-3">
                  {finding.description}
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-500 text-[11px]">
                <span className="font-semibold text-slate-700">Patient Cohort Evidence:</span> {finding.evidenceData}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Systemic Patterns Across Clinical Departments */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Systemic Hospital Operational Patterns
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Underlying organizational vulnerabilities cutting across multiple service lines and care modalities.
        </p>

        <div className="space-y-3 text-xs">
          {insights.systemicPatterns.map((pat, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{pat.patternName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    pat.significance === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pat.significance} Significance
                  </span>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Affected Service Lines:</span> {pat.affectedServiceLines.join(', ')}
                </div>
                <div className="text-teal-800 font-medium">
                  Recommended Action: {pat.suggestedAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflicting Interpretations Between Agents & Reconciliations */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Conflicting Agent Perspectives & Clinical Reconciliation
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Where business velocity and clinical safety priorities diverge, providing multi-perspective clarity for human leadership.
        </p>

        <div className="space-y-4 text-xs">
          {insights.conflictingInterpretations.map((conf, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm">{conf.topic}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-teal-800 block mb-1">Perspective A:</span>
                  <p className="text-slate-600">{conf.agentA.perspective}</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-rose-800 block mb-1">Perspective B:</span>
                  <p className="text-slate-600">{conf.agentB.perspective}</p>
                </div>
              </div>

              <div className="p-3 bg-teal-50/80 rounded-lg border border-teal-200 text-teal-900 font-medium">
                {conf.synthesisRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THE HUMAN REVIEW QUEUE & GOVERNANCE CHECKPOINT */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Human Review & Clinical Governance Queue
              </h2>
              <span className="text-xs font-mono bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
                {insights.humanReviewQueue.length} Mandatory Checkpoints
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict human-in-the-loop audit trail. No high-risk AI recommendation is executed without authorized clinical sign-off.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
            {(['all', 'Pending', 'Approved', 'Audited', 'Overridden'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Items */}
        <div className="space-y-4">
          {filteredQueue.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all text-xs ${
                item.status === 'Approved'
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : item.status === 'Overridden'
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 bg-white shadow-2xs'
              }`}
            >
              {/* Item Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900">{item.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono font-semibold text-teal-800">{item.patient_id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-medium text-slate-700">{item.service_line}</span>
                  <span className="text-slate-300">·</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.severity} Severity
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                    item.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Overridden'
                      ? 'bg-rose-100 text-rose-800'
                      : item.status === 'Audited'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>

                  <button
                    onClick={() => {
                      setActiveReviewItem(item);
                      setReviewNote(item.reviewNotes || '');
                    }}
                    className="text-teal-700 font-semibold hover:underline"
                  >
                    Open Clinical Sign-off Modal →
                  </button>
                </div>
              </div>

              {/* 5 Distinct Governance Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    1. AI-Generated Clinical Observation:
                  </span>
                  <p className="text-slate-600">{item.aiObservation}</p>
                </div>

                <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100">
                  <span className="font-bold text-teal-900 block mb-0.5">
                    2. AI-Generated Recommended Action:
                  </span>
                  <p className="text-teal-800">{item.aiRecommendation}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    3. Supporting Evidence from Dataset:
                  </span>
                  <p className="text-slate-600 italic">"{item.patientCommentSnippet}"</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    4. Professional / Managerial Review Context:
                  </span>
                  <p className="text-slate-600">{item.issueDescription}</p>
                </div>
              </div>

              {/* Final Decision Approved by Human */}
              {item.reviewedBy && (
                <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold">5. Human Sign-Off Recorded:</span> {item.reviewNotes}
                  </div>
                  <div className="font-mono text-[11px] text-emerald-700 shrink-0">
                    {item.reviewedBy} · {item.reviewTimestamp}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prioritized Follow-Up Actions Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Executive Action & Implementation Roadmap
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Assigned administrative leads, prioritized order of intervention, and target deadlines.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Priority</th>
                <th className="px-4 py-2.5">Strategic Action</th>
                <th className="px-4 py-2.5">Lead Owner</th>
                <th className="px-4 py-2.5">Target Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {insights.prioritizedNextActions.map((act) => (
                <tr key={act.priority} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-teal-800">
                    Priority {act.priority}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {act.action}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {act.leadOwner}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {act.targetCompletion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visible Responsible AI & Regulatory Disclaimer */}
      <div className="p-5 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-1.5 border border-slate-800">
        <p className="font-bold text-white uppercase tracking-wider text-[11px]">
          Responsible AI Notice & Decision-Support Boundary Notice
        </p>
        <p className="leading-relaxed text-slate-300">
          This clinical virtual office application and its six specialized AI agents function exclusively as operational decision-support instruments. They are designed to augment administrative review, quality improvement, and workflow prioritization. Under no circumstances do these agents independently render clinical diagnoses, prescribe pharmacological regimens, establish patient treatment protocols, initiate employment actions, or execute binding legal compliance verdicts without authorized human physician or executive review.
        </p>
      </div>

      {/* Human Review Modal Drawer */}
      {activeReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-teal-800 font-bold">{activeReviewItem.id}</span>
                <h3 className="text-base font-bold text-slate-900">Clinical Governance Sign-Off</h3>
              </div>
              <button
                onClick={() => setActiveReviewItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1">
              <div className="font-bold text-slate-800">{activeReviewItem.issueDescription}</div>
              <div className="text-slate-600 italic">"{activeReviewItem.patientCommentSnippet}"</div>
            </div>

            <div>
              <span className="font-bold text-teal-800 block mb-1">AI Recommendation:</span>
              <p className="text-slate-700">{activeReviewItem.aiRecommendation}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authorized Reviewer Name & Title:
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Clinical Sign-Off Notes & Decision Rationale:
              </label>
              <textarea
                rows={3}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Enter clinical rationale, policy action, or corrective audit instructions..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
              <button
                onClick={() => handleDecision('Overridden')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
              >
                Override AI
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecision('Audited')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200"
                >
                  Request Audit
                </button>
                <button
                  onClick={() => handleDecision('Approved')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Approve Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
