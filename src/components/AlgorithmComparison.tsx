import React, { useState } from 'react';
import { HospitalNode, DijkstraResult, BFSResult } from '../types/hospital';
import {
  GitCompare,
  Zap,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  Binary,
  CheckCircle,
  HelpCircle,
  Play
} from 'lucide-react';

interface AlgorithmComparisonProps {
  nodes: HospitalNode[];
  blockedCorridors: string[];
  startNode: string;
  destinationNode: string;
  onSetStart: (name: string) => void;
  onSetDestination: (name: string) => void;
  dijkstraResult: DijkstraResult | null;
  bfsResult: BFSResult | null;
  onRunComparison: (start: string, destination: string) => void;
  isRunning?: boolean;
}

export const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
  nodes,
  blockedCorridors,
  startNode,
  destinationNode,
  onSetStart,
  onSetDestination,
  dijkstraResult,
  bfsResult,
  onRunComparison,
  isRunning = false
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white font-sans">DAA Algorithmic Engine & Live Comparison</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Compare Dijkstra&apos;s Algorithm, Breadth-First Search (BFS), and Binary Min-Heap Priority Queue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <select
                value={startNode}
                onChange={(e) => onSetStart(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
              >
                {nodes.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={destinationNode}
                onChange={(e) => onSetDestination(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
              >
                {nodes.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
            </div>

            <button
              onClick={() => onRunComparison(startNode, destinationNode)}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-purple-600/20 cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Running Both...' : 'Run Side-by-Side'}</span>
            </button>
          </div>
        </div>

        {/* Live Side-by-Side Results Grid */}
        {dijkstraResult && bfsResult && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dijkstra Column */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-sm font-bold text-white">Dijkstra&apos;s Algorithm</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-700">
                  WEIGHTED OPTIMAL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">TOTAL TRANSIT TIME</div>
                  <div className="text-lg font-bold text-cyan-400">{dijkstraResult.total_cost.toFixed(1)} min</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">NODES SETTLED</div>
                  <div className="text-lg font-bold text-purple-300">{dijkstraResult.visited_nodes.length}</div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase">Route:</span>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-purple-200">
                  {dijkstraResult.path.join(' → ')}
                </div>
              </div>

              <p className="text-[11.5px] text-slate-300 italic leading-relaxed">
                Minimizes sum of corridor traversal weights. Safely circumvents congested or blocked passages.
              </p>
            </div>

            {/* BFS Column */}
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span className="text-sm font-bold text-white">Breadth-First Search (BFS)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                  MINIMUM HOPS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">CORRIDOR HOPS</div>
                  <div className="text-lg font-bold text-indigo-300">{bfsResult.hops} hops</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">UNWEIGHTED TIME</div>
                  <div className="text-lg font-bold text-slate-300">{bfsResult.total_cost.toFixed(1)} min</div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase">Route:</span>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-200">
                  {bfsResult.path.join(' → ')}
                </div>
              </div>

              <p className="text-[11.5px] text-slate-300 italic leading-relaxed">
                Explores graph layer-by-layer. Guarantees minimum number of department transfers/doorways.
              </p>
            </div>
          </div>
        )}

        {/* Theoretical Tradeoff Note */}
        <div className="mt-4 p-3 rounded-lg bg-[#090e1a] border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-cyan-400">Algorithmic Tradeoff:</span>
            <span className="text-slate-300">
              {' '}Dijkstra optimizes travel cost/time when edge weights matter (e.g. elevator delays, steep ramps). BFS optimizes hop count when edges are treated as unweighted (minimizing hallway transfers or airlock doors).
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Algorithm Cards (Section 14 Specification) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Dijkstra */}
        <div className="bg-[#0f172a] border border-purple-900/40 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">DIJKSTRA</h3>
                <span className="text-[11px] text-purple-400 font-mono">Weighted Shortest Path</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono">
              <span className="text-slate-400 text-[10px] block">COMPLEXITY</span>
              <span className="text-cyan-400 font-bold text-sm">O((V + E) log V)</span>
              <span className="text-[10px] text-slate-500 block">with binary min-heap</span>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Primary Purpose:</span>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                Computes the lowest cumulative transit time route from ambulance arrival to resuscitation bay.
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Use in RapidRoute+:</span>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                Emergency route optimization. Evaluates corridor transit weights in minutes, skips blocked tunnels, and relaxes edge distances greedily.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Priority Queue */}
        <div className="bg-[#0f172a] border border-rose-900/40 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PRIORITY QUEUE</h3>
                <span className="text-[11px] text-rose-400 font-mono">Binary Min-Heap</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono">
              <span className="text-slate-400 text-[10px] block">COMPLEXITY</span>
              <span className="text-rose-400 font-bold text-sm">O(log n) Push/Pop</span>
              <span className="text-[10px] text-slate-500 block">O(1) Peek at Heap Root</span>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Primary Purpose:</span>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                Guarantees that high-acuity medical emergencies (Cardiac STEMI, polytrauma) are routed immediately ahead of stable patients.
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Use in RapidRoute+:</span>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                Emergency triage scheduling. Min-heap sorts by clinical severity (Critical 1 → Low 4) with timestamp tiebreakers.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: BFS */}
        <div className="bg-[#0f172a] border border-indigo-900/40 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Binary className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">BFS</h3>
                <span className="text-[11px] text-indigo-400 font-mono">Breadth-First Search</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono">
              <span className="text-slate-400 text-[10px] block">COMPLEXITY</span>
              <span className="text-indigo-400 font-bold text-sm">O(V + E)</span>
              <span className="text-[10px] text-slate-500 block">Linear level-order queue</span>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Primary Purpose:</span>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                Explores graph connectivity, checks department reachability, and identifies minimum-hop transfers across departments.
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Use in RapidRoute+:</span>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                Hospital connectivity verification & unweighted baseline comparison against Dijkstra&apos;s travel time minimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
