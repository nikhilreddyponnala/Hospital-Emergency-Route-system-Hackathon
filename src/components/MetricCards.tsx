import React from 'react';
import { Flame, ShieldAlert, Clock, Activity, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  activeEmergencies: number;
  criticalCases: number;
  blockedCorridors: number;
  averageRouteTime: number;
  onNavigateToQueue: () => void;
  onNavigateToMap: () => void;
  onNavigateToPlanner: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  activeEmergencies,
  criticalCases,
  blockedCorridors,
  averageRouteTime,
  onNavigateToQueue,
  onNavigateToMap,
  onNavigateToPlanner
}) => {
  return (
    <div className="space-y-4">
      {/* Hero Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Live Emergency Triage & Route Command
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans">
            Emergency Route Command Center
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Find the fastest safe route through the hospital while intelligently prioritizing critical emergencies with Dijkstra&apos;s algorithm and Min-Heap scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optimal Routing: Active</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Emergencies */}
        <div 
          onClick={onNavigateToQueue}
          className="group relative bg-[#0f172a] hover:bg-[#131f38] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Emergencies</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums tracking-tight">
              {activeEmergencies}
            </span>
            <span className="text-xs text-rose-400 font-medium">In Queue</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Priority Queue Heap</span>
            <span className="flex items-center text-slate-400 group-hover:text-cyan-400 font-medium">
              View Queue <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Critical Cases */}
        <div 
          onClick={onNavigateToQueue}
          className="group relative bg-[#0f172a] hover:bg-[#131f38] border border-slate-800 hover:border-rose-900/60 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Cases</span>
            <div className="p-2 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-rose-400 tabular-nums tracking-tight">
              {criticalCases}
            </span>
            <span className="text-xs text-rose-400 font-semibold">Priority 1 Triage</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Cardiac / Severe Trauma</span>
            <span className="flex items-center text-slate-400 group-hover:text-rose-400 font-medium">
              Immediate Action <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Blocked Corridors */}
        <div 
          onClick={onNavigateToMap}
          className="group relative bg-[#0f172a] hover:bg-[#131f38] border border-slate-800 hover:border-amber-900/60 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Blocked Corridors</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums tracking-tight">
              {blockedCorridors}
            </span>
            <span className="text-xs text-amber-400 font-medium">Excluded by Dijkstra</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Rerouting Triggered</span>
            <span className="flex items-center text-slate-400 group-hover:text-amber-400 font-medium">
              Inspect Blockages <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Average Route Time */}
        <div 
          onClick={onNavigateToPlanner}
          className="group relative bg-[#0f172a] hover:bg-[#131f38] border border-slate-800 hover:border-cyan-900/60 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Route Time</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyan-400 tabular-nums tracking-tight">
              {averageRouteTime.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-medium">min travel time</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Dijkstra Minimum-Cost</span>
            <span className="flex items-center text-slate-400 group-hover:text-cyan-400 font-medium">
              Open Planner <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
