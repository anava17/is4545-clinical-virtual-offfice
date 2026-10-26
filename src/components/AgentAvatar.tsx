/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgentId, AgentStatus } from '../types/clinical';

interface AgentAvatarProps {
  agentId: AgentId;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  status,
  size = 'md',
  showBadge = true
}) => {
  const isWorking = status === 'processing';

  // Dimension mapping
  const sizeMap = {
    sm: { container: 'w-10 h-10', svg: 40 },
    md: { container: 'w-16 h-16', svg: 64 },
    lg: { container: 'w-24 h-24', svg: 96 },
    xl: { container: 'w-32 h-32', svg: 128 }
  };

  const dim = sizeMap[size];

  // Specific visuals per agent persona
  const renderAgentVisuals = () => {
    switch (agentId) {
      case 'agent1': // Dr. Evelyn Reed - Teal, Linguistics, Stethoscope
        return (
          <g>
            {/* Background office halo */}
            <circle cx="32" cy="32" r="30" fill="#0f766e" fillOpacity="0.12" />
            <circle cx="32" cy="32" r="28" stroke="#0d9488" strokeWidth="1.5" strokeDasharray={isWorking ? "4 2" : "none"} className={isWorking ? "animate-spin" : ""} style={{ transformOrigin: 'center', animationDuration: '6s' }} />
            {/* Hair */}
            <path d="M20 28 C20 16, 44 16, 44 28 C44 32, 42 36, 42 36 L22 36 Z" fill="#78350f" />
            {/* Face */}
            <ellipse cx="32" cy="27" rx="10" ry="11" fill="#fbcfe8" />
            {/* Eyes */}
            <circle cx="28" cy="26" r="1.5" fill="#1e293b" />
            <circle cx="36" cy="26" r="1.5" fill="#1e293b" />
            {/* Smile / expression */}
            <path d="M29 31 Q32 34 35 31" stroke="#be185d" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Glasses */}
            <rect x="25" y="24" width="6" height="4" rx="1" stroke="#0f172a" strokeWidth="0.8" fill="none" />
            <rect x="33" y="24" width="6" height="4" rx="1" stroke="#0f172a" strokeWidth="0.8" fill="none" />
            <line x1="31" y1="26" x2="33" y2="26" stroke="#0f172a" strokeWidth="0.8" />
            {/* Lab Coat / Scrub */}
            <path d="M19 46 L24 37 L40 37 L45 46 C42 56, 22 56, 19 46 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M28 37 L32 44 L36 37" fill="#0d9488" />
            {/* Stethoscope */}
            <path d="M26 40 Q32 48 38 40" stroke="#0f172a" strokeWidth="1.2" fill="none" />
            <circle cx="32" cy="46" r="2" fill="#0d9488" />
          </g>
        );

      case 'agent2': // Dr. Marcus Vance - Indigo, Equity Observability
        return (
          <g>
            <circle cx="32" cy="32" r="30" fill="#4338ca" fillOpacity="0.12" />
            <circle cx="32" cy="32" r="28" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray={isWorking ? "3 3" : "none"} className={isWorking ? "animate-spin" : ""} style={{ transformOrigin: 'center', animationDuration: '8s' }} />
            {/* Hair */}
            <path d="M22 25 C22 17, 42 17, 42 25 Z" fill="#1e293b" />
            {/* Face */}
            <ellipse cx="32" cy="27" rx="10" ry="11" fill="#fed7aa" />
            {/* Eyes */}
            <circle cx="28" cy="26" r="1.5" fill="#1e293b" />
            <circle cx="36" cy="26" r="1.5" fill="#1e293b" />
            <path d="M29 32 Q32 34 35 32" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Beard */}
            <path d="M26 31 C26 38, 38 38, 38 31" stroke="#334155" strokeWidth="1" fill="none" />
            {/* Medical Attire */}
            <path d="M18 46 L24 36 L40 36 L46 46 C42 56, 22 56, 18 46 Z" fill="#312e81" />
            <path d="M29 36 L32 42 L35 36" fill="#818cf8" />
            {/* Smart Clipboard */}
            <rect x="36" y="42" width="10" height="14" rx="1.5" fill="#f8fafc" stroke="#4f46e5" strokeWidth="1" />
            <line x1="38" y1="46" x2="44" y2="46" stroke="#4f46e5" strokeWidth="1" />
            <line x1="38" y1="49" x2="44" y2="49" stroke="#4f46e5" strokeWidth="1" />
          </g>
        );

      case 'agent3': // Nurse Director Sarah Lin - Rose, High Acuity Triage
        return (
          <g>
            <circle cx="32" cy="32" r="30" fill="#be123c" fillOpacity="0.12" />
            <circle cx="32" cy="32" r="28" stroke="#e11d48" strokeWidth="1.5" strokeDasharray={isWorking ? "5 2" : "none"} className={isWorking ? "animate-spin" : ""} style={{ transformOrigin: 'center', animationDuration: '4s' }} />
            {/* Hair Bun */}
            <circle cx="32" cy="18" r="6" fill="#1c1917" />
            <path d="M22 28 C22 19, 42 19, 42 28 Z" fill="#1c1917" />
            {/* Face */}
            <ellipse cx="32" cy="28" rx="9.5" ry="10" fill="#fde68a" />
            <circle cx="28" cy="27" r="1.5" fill="#1e293b" />
            <circle cx="36" cy="27" r="1.5" fill="#1e293b" />
            <path d="M30 33 Q32 35 34 33" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Clinical Scrubs */}
            <path d="M18 47 L24 37 L40 37 L46 47 C42 56, 22 56, 18 47 Z" fill="#be123c" />
            <path d="M29 37 L32 43 L35 37" fill="#fecdd3" />
            {/* Emergency badge */}
            <rect x="23" y="43" width="6" height="8" rx="1" fill="#fff" stroke="#e11d48" strokeWidth="0.8" />
            <line x1="25" y1="45" x2="27" y2="45" stroke="#e11d48" strokeWidth="1" />
            <line x1="26" y1="44" x2="26" y2="46" stroke="#e11d48" strokeWidth="1" />
          </g>
        );

      case 'agent4': // Director Arthur Sterling - Amber, Hospital Operations
        return (
          <g>
            <circle cx="32" cy="32" r="30" fill="#b45309" fillOpacity="0.12" />
            <circle cx="32" cy="32" r="28" stroke="#d97706" strokeWidth="1.5" strokeDasharray={isWorking ? "4 3" : "none"} className={isWorking ? "animate-spin" : ""} style={{ transformOrigin: 'center', animationDuration: '7s' }} />
            {/* Hair - silver executive */}
            <path d="M21 27 C21 17, 43 17, 43 27 Z" fill="#94a3b8" />
            {/* Face */}
            <ellipse cx="32" cy="28" rx="10" ry="11" fill="#fed7aa" />
            <circle cx="28" cy="27" r="1.5" fill="#1e293b" />
            <circle cx="36" cy="27" r="1.5" fill="#1e293b" />
            <path d="M29 33 Q32 35 35 33" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Glasses */}
            <circle cx="28" cy="27" r="3" stroke="#475569" strokeWidth="0.8" fill="none" />
            <circle cx="36" cy="27" r="3" stroke="#475569" strokeWidth="0.8" fill="none" />
            <line x1="31" y1="27" x2="33" y2="27" stroke="#475569" strokeWidth="0.8" />
            {/* Executive Suit */}
            <path d="M18 47 L24 37 L40 37 L46 47 C42 56, 22 56, 18 47 Z" fill="#334155" />
            <path d="M29 37 L32 45 L35 37" fill="#ffffff" />
            {/* Tie */}
            <path d="M31 39 L33 39 L32 46 Z" fill="#d97706" />
          </g>
        );

      case 'agent5': // Dr. Priya Chen - Blue, Biostatistician & Executive Analytics
        return (
          <g>
            <circle cx="32" cy="32" r="30" fill="#1d4ed8" fillOpacity="0.12" />
            <circle cx="32" cy="32" r="28" stroke="#2563eb" strokeWidth="1.5" strokeDasharray={isWorking ? "6 2" : "none"} className={isWorking ? "animate-spin" : ""} style={{ transformOrigin: 'center', animationDuration: '5s' }} />
            {/* Hair */}
            <path d="M20 30 C20 16, 44 16, 44 30 L44 38 L20 38 Z" fill="#18181b" />
            {/* Face */}
            <ellipse cx="32" cy="28" rx="9.5" ry="10" fill="#fcd34d" />
            <circle cx="28" cy="27" r="1.5" fill="#1e293b" />
            <circle cx="36" cy="27" r="1.5" fill="#1e293b" />
            <path d="M29 33 Q32 35 35 33" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Modern Blazer */}
            <path d="M18 47 L24 37 L40 37 L46 47 C42 56, 22 56, 18 47 Z" fill="#1e3a8a" />
            <path d="M28 37 L32 44 L36 37" fill="#bfdbfe" />
            {/* Analytics Hologram pin */}
            <circle cx="25" cy="42" r="2" fill="#60a5fa" />
          </g>
        );

      case 'agent6': // Elena Rostova, MBA - Emerald, Business & Strategy
        return (
          <g>
            <circle cx="32" cy="32" r="30" fill="#047857" fillOpacity="0.12" />
            <circle cx="32" cy="32" r="28" stroke="#059669" strokeWidth="1.5" strokeDasharray={isWorking ? "3 2" : "none"} className={isWorking ? "animate-spin" : ""} style={{ transformOrigin: 'center', animationDuration: '6s' }} />
            {/* Hair */}
            <path d="M21 28 C21 16, 43 16, 43 28 L43 35 C40 37, 24 37, 21 35 Z" fill="#451a03" />
            {/* Face */}
            <ellipse cx="32" cy="27" rx="9.5" ry="10.5" fill="#fed7aa" />
            <circle cx="28" cy="26" r="1.5" fill="#1e293b" />
            <circle cx="36" cy="26" r="1.5" fill="#1e293b" />
            <path d="M29 32 Q32 34 35 32" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Emerald Executive Suit */}
            <path d="M18 46 L24 36 L40 36 L46 46 C42 56, 22 56, 18 46 Z" fill="#064e3b" />
            <path d="M29 36 L32 44 L35 36" fill="#d1fae5" />
            {/* Golden Pin */}
            <circle cx="24" cy="40" r="1.8" fill="#fbbf24" />
          </g>
        );
    }
  };

  return (
    <div className={`relative ${dim.container} shrink-0 select-none flex items-center justify-center`}>
      {/* Outer ambient glow during processing */}
      {isWorking && (
        <div className="absolute inset-0 rounded-full animate-ping bg-teal-400 opacity-20 pointer-events-none" />
      )}

      {/* SVG Avatar */}
      <svg
        viewBox="0 0 64 64"
        className={`w-full h-full transition-transform duration-300 ${
          isWorking ? 'animate-pulse-slow scale-105' : 'hover:scale-102'
        }`}
      >
        {renderAgentVisuals()}

        {/* Live processing activity overlay: typing hands / telemetry waves */}
        {isWorking && (
          <g>
            <rect x="20" y="52" width="24" height="4" rx="2" fill="#0f172a" fillOpacity="0.8" />
            <circle cx="26" cy="54" r="1" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '1s' }} />
            <circle cx="32" cy="54" r="1" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '1.2s' }} />
            <circle cx="38" cy="54" r="1" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '1.4s' }} />
          </g>
        )}
      </svg>

      {/* Status indicator badge */}
      {showBadge && (
        <span
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[8px] font-bold ${
            status === 'processing'
              ? 'bg-amber-500 text-white animate-spin'
              : status === 'completed'
              ? 'bg-emerald-500 text-white'
              : status === 'selected'
              ? 'bg-blue-600 text-white'
              : status === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-300 text-slate-700'
          }`}
          title={`Status: ${status}`}
        >
          {status === 'completed' ? '✓' : status === 'processing' ? '⟳' : status === 'selected' ? '●' : ''}
        </span>
      )}
    </div>
  );
};
