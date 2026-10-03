import React from 'react';
import {
  Activity,
  ArrowRight,
  ShieldAlert,
  Zap,
  Layers,
  Binary,
  GitBranch,
  Sparkles,
  Ambulance,
  HeartPulse,
  Clock,
  Play,
  Building2,
  MapPin
} from 'lucide-react';
import { RapidRouteLogo } from './RapidRouteLogo';

interface LandingHeroProps {
  onLaunchDashboard: () => void;
  onExploreAlgorithms: () => void;
  onLaunchDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchDashboard,
  onExploreAlgorithms,
  onLaunchDemo
}) => {
  return (
    <div className="space-y-10 py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e172e] via-[#090e1c] to-[#060912] border border-cyan-500/30 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono font-semibold">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>DAA HACKATHON PROJECT · PRODUCTION SPECIFICATION</span>
          </div>

          {/* Official Branding Display */}
          <RapidRouteLogo variant="hero" />

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Use graph algorithms to find faster, safer routes for emergency patients and ambulances while intelligently prioritizing critical emergencies with Dijkstra&apos;s algorithm, Min-Heap scheduling, and BFS reachability.
          </p>

          {/* Call to Actions */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <button
              onClick={onLaunchDashboard}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
            >
              <span>Launch Emergency Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreAlgorithms}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <span>Explore Algorithms</span>
            </button>

            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/80 text-purple-200 font-bold text-sm transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-purple-300" />
              <span>🎬 Hackathon Demo (60s)</span>
            </button>
          </div>
        </div>

        {/* Meaning Behind the Logo (From attached graphic) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-300 space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold text-center sm:text-left">
            MEANING BEHIND THE LOGO
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center sm:text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Ambulance className="w-4 h-4" />
                <span>Ambulance</span>
              </div>
              <div className="text-[10.5px] text-slate-400 mt-1">Emergency response &amp; speed</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Building2 className="w-4 h-4" />
                <span>Hospital</span>
              </div>
              <div className="text-[10.5px] text-slate-400 mt-1">Care, treatment &amp; safety</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                <GitBranch className="w-4 h-4" />
                <span>Path / Route</span>
              </div>
              <div className="text-[10.5px] text-slate-400 mt-1">Finding fastest safe way</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <MapPin className="w-4 h-4" />
                <span>Location Pin</span>
              </div>
              <div className="text-[10.5px] text-slate-400 mt-1">Navigation &amp; guidance</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                <HeartPulse className="w-4 h-4" />
                <span>Heartbeat</span>
              </div>
              <div className="text-[10.5px] text-slate-400 mt-1">Saving lives &amp; urgency</div>
            </div>
          </div>
        </div>

        {/* Visual Hospital Graph Abstract in Hero */}
        <div className="mt-6 p-4 rounded-2xl bg-[#070b16]/90 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>Hospital Topology Preview: 12 Nodes · 18 Weighted Corridors</span>
            <span>Active Obstruction Bypass: Enabled</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto py-1 font-mono text-[11px] text-slate-300">
            <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800 shrink-0 font-bold">
              Emergency Gate (0m)
            </div>
            <span className="text-slate-600 shrink-0">→ 2m →</span>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              Emergency Dept
            </div>
            <span className="text-rose-500 font-bold shrink-0">──X── BLOCKED (Direct to ICU)</span>
            <span className="text-purple-400 shrink-0">→ 3m detour →</span>
            <div className="px-3 py-1.5 rounded-lg bg-purple-950/80 text-purple-200 border border-purple-800 shrink-0 font-bold">
              Diagnostics Lab (5m)
            </div>
            <span className="text-purple-400 shrink-0">→ 3m →</span>
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 shrink-0 font-bold">
              ICU Target (8m Total)
            </div>
          </div>
        </div>
      </div>

      {/* 5 Feature Cards (Section 29 Specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ambulance className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">🚑 Emergency Routing</h3>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            Real-time ambulance and patient dispatch through complex multi-floor hospital wings.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">⚡ Priority Scheduling</h3>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            Binary Min-Heap prioritizing Critical P1 cases (STEMI, trauma) ahead of non-acute cases.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">🧠 Dijkstra Optimization</h3>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            $O((V+E)\log V)$ greedy edge relaxation minimizing total travel cost in minutes.
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Binary className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">🔎 BFS Exploration</h3>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            Level-by-level queue traversal finding minimum corridor hops and proving reachability.
          </p>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">🚧 Corridor Detection</h3>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            Instant detection of blocked hallways, automatically rerouting along safe concourses.
          </p>
        </div>
      </div>
    </div>
  );
};
