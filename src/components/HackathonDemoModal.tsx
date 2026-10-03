import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Flame,
  ShieldAlert,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDemoStep: (stepNumber: number) => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onResetDemo: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({
  isOpen,
  onClose,
  onApplyDemoStep,
  currentStep,
  onNextStep,
  onPrevStep,
  onResetDemo,
  isAutoPlaying,
  onToggleAutoPlay
}) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Emergency Intake & Triage Priority',
      speakerScript: 'Welcome to RapidRoute+. When multiple ambulances arrive, the hospital must decide who gets dispatched first. Our custom Priority Queue (Min-Heap) dynamically ranks emergencies by clinical severity and arrival timestamp.',
      badge: 'PRIORITY QUEUE',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      actionPrompt: 'EMR-104 (Cardiac STEMI) is evaluated as CRITICAL (Priority 1) and placed at the root of the Min-Heap ahead of trauma and fractures.'
    },
    {
      step: 2,
      title: 'Department Destination & Route Constraints',
      speakerScript: 'Patient EMR-104 requires immediate admission to the Intensive Care Unit (ICU). Origin is set to Emergency Gate, destination to ICU.',
      badge: 'GRAPH TOPOLOGY',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      actionPrompt: 'Origin: Emergency Gate → Destination: ICU. The graph maps 12 clinical locations and 18 corridors with weighted transit times.'
    },
    {
      step: 3,
      title: 'Active Corridor Blockage Detection',
      speakerScript: 'The direct Emergency Department ↔ ICU express elevator corridor is currently BLOCKED due to an emergency hazard. The system immediately isolates this edge.',
      badge: 'BLOCKED CORRIDOR',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      actionPrompt: 'Corridor "Emergency Department ↔ ICU" flagged as BLOCKED. Direct 2-minute transit is unavailable; alternative route required.'
    },
    {
      step: 4,
      title: "Executing Dijkstra's Algorithm",
      speakerScript: "Dijkstra's algorithm begins from Emergency Gate. It initializes all distances to infinity and greedily settles nodes by minimum tentative cost using a min-heap.",
      badge: 'DIJKSTRA RELAXATION',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      actionPrompt: 'Dijkstra explores Emergency Department (2m), Reception (3m), Diagnostics Lab (5m), relaxing safe adjacent corridors.'
    },
    {
      step: 5,
      title: 'Optimal Detour Locked: 8.0 Minutes',
      speakerScript: 'Dijkstra successfully bypassed the blocked corridor and selected Emergency Gate → Emergency Department → Diagnostics Lab → ICU with a total cost of 8.0 minutes.',
      badge: 'SAFE ROUTE LOCKED',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      actionPrompt: 'Final route locked in 8.0 min transit time over 3 corridor segments. Ambulance dispatch simulation initialized.'
    },
    {
      step: 6,
      title: 'BFS Comparison & Complexity Tradeoff',
      speakerScript: 'We run Breadth-First Search (BFS) side-by-side. BFS minimizes the number of hops (3 hops), while Dijkstra minimizes weighted cumulative transit time (8.0 min).',
      badge: 'BFS COMPARISON',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      actionPrompt: 'Dijkstra optimizes time when weights matter; BFS optimizes hop count when edges are unweighted. RapidRoute+ makes this decision visible.'
    }
  ];

  const activeDemo = demoSteps[currentStep - 1] || demoSteps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-cyan-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">🎬 Hackathon Judge Demonstration</h2>
              <p className="text-[11px] text-slate-400">Guided Walkthrough of Dijkstra, BFS, and Priority Queue</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3 bg-[#0d1424] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            {demoSteps.map((s) => (
              <div
                key={s.step}
                onClick={() => onApplyDemoStep(s.step)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  s.step === currentStep
                    ? 'w-8 bg-cyan-400'
                    : s.step < currentStep
                    ? 'w-4 bg-purple-500'
                    : 'w-3 bg-slate-700'
                }`}
                title={`Jump to Step ${s.step}`}
              />
            ))}
          </div>

          <span className="text-cyan-400 font-bold">
            STEP {currentStep} OF {demoSteps.length}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${activeDemo.badgeColor}`}>
              {activeDemo.badge}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">{activeDemo.title}</h3>

          {/* Speaker Script Card */}
          <div className="p-4 rounded-xl bg-[#090d18] border border-cyan-800/40 text-xs text-slate-200 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              SPEAKER PRESENTATION SCRIPT:
            </span>
            <p className="text-sm text-cyan-100 font-medium leading-relaxed italic">
              &quot;{activeDemo.speakerScript}&quot;
            </p>
          </div>

          {/* Action Impact Callout */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Live System Action: </span>
              <span>{activeDemo.actionPrompt}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#0a1020] border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < demoSteps.length ? (
              <button
                onClick={onNextStep}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-purple-600/20 cursor-pointer active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              >
                <span>Finish Demo</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
