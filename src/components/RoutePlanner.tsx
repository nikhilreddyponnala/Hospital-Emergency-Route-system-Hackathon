import React, { useState } from 'react';
import {
  HospitalNode,
  DijkstraResult,
  BFSResult,
  DijkstraStep,
  BFSStep
} from '../types/hospital';
import {
  Navigation,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  SkipForward,
  Info,
  Clock,
  GitCommit,
  Layers,
  ArrowRight
} from 'lucide-react';

interface RoutePlannerProps {
  nodes: HospitalNode[];
  blockedCorridors: string[];
  startNode: string;
  destinationNode: string;
  onSetStart: (name: string) => void;
  onSetDestination: (name: string) => void;
  onCalculateRoute: (start: string, destination: string, algorithm: 'Dijkstra' | 'BFS') => void;
  onToggleCorridor: (corridorKey: string) => void;
  dijkstraResult: DijkstraResult | null;
  bfsResult: BFSResult | null;
  selectedAlgorithm: 'Dijkstra' | 'BFS';
  onSelectAlgorithm: (algo: 'Dijkstra' | 'BFS') => void;
  isCalculating?: boolean;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  nodes,
  blockedCorridors,
  startNode,
  destinationNode,
  onSetStart,
  onSetDestination,
  onCalculateRoute,
  onToggleCorridor,
  dijkstraResult,
  bfsResult,
  selectedAlgorithm,
  onSelectAlgorithm,
  isCalculating = false
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isPlayingSteps, setIsPlayingSteps] = useState<boolean>(false);

  const activeResult = selectedAlgorithm === 'Dijkstra' ? dijkstraResult : bfsResult;

  const handleSimulateBlockage = (corridor: string) => {
    onToggleCorridor(corridor);
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Planner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-sans">Emergency Route Planner</h2>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-cyan-300 font-semibold border border-slate-700">
              Interactive DAA Solver
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure origin, destination, and algorithm to calculate real-time transit times avoiding corridor hazards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCalculateRoute(startNode, destinationNode, selectedAlgorithm)}
            disabled={isCalculating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/20 transition-all cursor-pointer active:scale-95 ${
              isCalculating ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isCalculating ? 'Computing Optimal Route...' : 'Calculate Route'}</span>
          </button>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Start Location (Origin)
          </label>
          <select
            value={startNode}
            onChange={(e) => onSetStart(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.name}>{n.name} ({n.floor})</option>
            ))}
          </select>
        </div>

        {/* Destination Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Destination Location
          </label>
          <select
            value={destinationNode}
            onChange={(e) => onSetDestination(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400 cursor-pointer"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.name}>{n.name} ({n.floor})</option>
            ))}
          </select>
        </div>

        {/* Algorithm Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Routing Algorithm
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => onSelectAlgorithm('Dijkstra')}
              className={`py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedAlgorithm === 'Dijkstra'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dijkstra (Weighted)
            </button>
            <button
              onClick={() => onSelectAlgorithm('BFS')}
              className={`py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedAlgorithm === 'BFS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BFS (Min Hops)
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Blockage Quick Simulator */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Corridor Blockage Simulation</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click to toggle corridor status and observe dynamic Dijkstra rerouting
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-1">
          {[
            { key: 'Emergency Department|ICU', label: 'Emergency Department ↔ ICU (Direct Trauma Lift)' },
            { key: 'Diagnostics Lab|ICU', label: 'Diagnostics Lab ↔ ICU (Critical Skybridge)' },
            { key: 'Operation Theatre|ICU', label: 'Operation Theatre ↔ ICU (Post-Op Corridor)' }
          ].map((corridor) => {
            const isCorridorBlocked = blockedCorridors.includes(corridor.key) || 
              blockedCorridors.includes(corridor.key.replace('|', '::')) ||
              blockedCorridors.includes(corridor.key.split('|').reverse().join('|'));

            return (
              <button
                key={corridor.key}
                onClick={() => handleSimulateBlockage(corridor.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCorridorBlocked
                    ? 'bg-rose-950/70 border-rose-600 text-rose-300 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <span>{isCorridorBlocked ? '🛑 BLOCKED:' : '🟢 OPEN:'}</span>
                <span>{corridor.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Route Calculation Result Card */}
      {activeResult && activeResult.success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d1e38] to-[#16122d] border border-cyan-500/40 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  SAFE ROUTE FOUND
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  Algorithm: {activeResult.algorithm}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Total Travel Cost: </span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {activeResult.total_cost.toFixed(1)} minutes
                  </span>
                </div>
                {selectedAlgorithm === 'BFS' && 'hops' in activeResult && (
                  <div>
                    <span className="text-slate-400">Hops: </span>
                    <span className="text-purple-400 font-bold text-sm">{activeResult.hops}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Nodes Settled: </span>
                  <span className="text-white font-bold">{activeResult.visited_nodes.length}</span>
                </div>
              </div>
            </div>

            {/* Path Breadcrumb */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Calculated Route Sequence:
              </span>
              <div className="flex items-center gap-2 flex-wrap bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
                {activeResult.path.map((nodeName, idx) => (
                  <React.Fragment key={nodeName}>
                    <span
                      className={`px-2.5 py-1 rounded font-bold ${
                        idx === 0
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : idx === activeResult.path.length - 1
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-purple-950/80 text-purple-200 border border-purple-800/60'
                      }`}
                    >
                      {nodeName}
                    </span>
                    {idx < activeResult.path.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Why This Route? (Judge-Friendly Explanation) */}
            <div className="p-3 rounded-lg bg-[#070b14]/90 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why was this route selected?</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                {selectedAlgorithm === 'Dijkstra' && 'why_this_route' in activeResult
                  ? activeResult.why_this_route
                  : selectedAlgorithm === 'BFS' && 'explanation' in activeResult
                  ? activeResult.explanation
                  : 'Path chosen by algorithm invariant.'}
              </p>
            </div>
          </div>

          {/* Decision Trace / Step-by-Step Visualization Panel */}
          {selectedAlgorithm === 'Dijkstra' && dijkstraResult && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Dijkstra Decision Trace ({dijkstraResult.steps.length} Steps)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Priority Queue State & Edge Relaxations
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {dijkstraResult.steps.map((st) => (
                  <div
                    key={st.step}
                    className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800 text-xs font-mono space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-purple-400 font-bold">Step {st.step}</span>
                      <span className="text-cyan-300">
                        Selected: <strong className="text-white">{st.selected_node}</strong> (Cost: {st.cost.toFixed(1)}m)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">{st.action}</div>

                    {st.evaluated_neighbors.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-800/80">
                        {st.evaluated_neighbors.map((nb, i) => (
                          <div
                            key={i}
                            className={`text-[10px] pl-2 border-l-2 ${
                              nb.status === 'UPDATED'
                                ? 'border-emerald-500 text-emerald-300'
                                : nb.status === 'BLOCKED'
                                ? 'border-rose-500 text-rose-400'
                                : 'border-slate-700 text-slate-400'
                            }`}
                          >
                            <strong>{nb.neighbor}</strong> ({nb.edge_weight}m) · {nb.status}: {nb.note}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BFS Exploration Panel */}
          {selectedAlgorithm === 'BFS' && bfsResult && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    BFS Level-by-Level Exploration Trace
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  FIFO Queue Snapshots
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {bfsResult.steps.map((st) => (
                  <div
                    key={st.step}
                    className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800 text-xs font-mono space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-indigo-400 font-bold">Step {st.step}</span>
                      <span className="text-white font-bold">{st.current_node}</span>
                      <span className="text-slate-400">Depth: {st.depth ?? 0} hops</span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      Queue Snapshot: <span className="text-cyan-400">[{st.queue_snapshot.join(', ') || 'Empty'}]</span>
                    </div>

                    <div className="text-[10px] text-slate-400">{st.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeResult && !activeResult.success ? (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertOctagon className="w-4 h-4" />
            <span>Routing Error: No Safe Route Available</span>
          </div>
          <p>{activeResult.error}</p>
        </div>
      ) : null}
    </div>
  );
};
