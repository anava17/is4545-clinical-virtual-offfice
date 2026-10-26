/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type ScreenType = 'office' | 'upload' | 'config' | 'processing' | 'results' | 'executive';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  selectedAgentCount: number;
  isAnalyzing: boolean;
  hasResults: boolean;
  onQuickStart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  selectedAgentCount,
  isAnalyzing,
  hasResults,
  onQuickStart
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => onNavigate('office')}
          className="flex items-center gap-2.5 text-left text-slate-900 hover:text-teal-700 transition-colors shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            CA
          </div>
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">
            Clinical AI Virtual Office
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('office')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentScreen === 'office'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Virtual Offices
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentScreen === 'upload'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Data & Validation
          </button>

          <button
            onClick={() => onNavigate('config')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentScreen === 'config'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Agent Setup
          </button>

          <button
            onClick={() => onNavigate('processing')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 flex items-center gap-1.5 ${
              currentScreen === 'processing'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            {isAnalyzing && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
            Live Workspace
          </button>

          <button
            onClick={() => onNavigate('results')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentScreen === 'results'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Agent Results
          </button>

          <button
            onClick={() => onNavigate('executive')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              currentScreen === 'executive'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Executive Summary
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAnalyzing ? (
            <button
              onClick={() => onNavigate('processing')}
              className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span className="animate-spin text-sm">⟳</span>
              Processing Live ({selectedAgentCount} Active)
            </button>
          ) : hasResults ? (
            <button
              onClick={() => onNavigate('executive')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              View Executive Summary
            </button>
          ) : (
            <button
              onClick={onQuickStart}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Run Clinical Analysis
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-2 overflow-x-auto border-t border-slate-100 bg-slate-50 text-xs">
        <button
          onClick={() => onNavigate('office')}
          className={`whitespace-nowrap font-medium ${currentScreen === 'office' ? 'text-teal-700 font-bold' : 'text-slate-600'}`}
        >
          Offices
        </button>
        <button
          onClick={() => onNavigate('upload')}
          className={`whitespace-nowrap font-medium ${currentScreen === 'upload' ? 'text-teal-700 font-bold' : 'text-slate-600'}`}
        >
          Upload
        </button>
        <button
          onClick={() => onNavigate('config')}
          className={`whitespace-nowrap font-medium ${currentScreen === 'config' ? 'text-teal-700 font-bold' : 'text-slate-600'}`}
        >
          Config
        </button>
        <button
          onClick={() => onNavigate('processing')}
          className={`whitespace-nowrap font-medium ${currentScreen === 'processing' ? 'text-teal-700 font-bold' : 'text-slate-600'}`}
        >
          Workspace
        </button>
        <button
          onClick={() => onNavigate('results')}
          className={`whitespace-nowrap font-medium ${currentScreen === 'results' ? 'text-teal-700 font-bold' : 'text-slate-600'}`}
        >
          Results
        </button>
        <button
          onClick={() => onNavigate('executive')}
          className={`whitespace-nowrap font-medium ${currentScreen === 'executive' ? 'text-teal-700 font-bold' : 'text-slate-600'}`}
        >
          Executive
        </button>
      </div>
    </header>
  );
};
