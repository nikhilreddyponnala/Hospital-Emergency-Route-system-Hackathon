import React from 'react';
import {
  Play,
  Zap,
  Building2,
  GitBranch,
  ShieldAlert,
  Flame,
  Menu,
  ChevronRight
} from 'lucide-react';
import { RapidRouteLogo } from './RapidRouteLogo';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  blockedCount: number;
  emergencyCount: number;
  onStartHackathonDemo: () => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  blockedCount,
  emergencyCount,
  onStartHackathonDemo,
  onStartSimulation,
  isSimulating,
  onToggleMobileSidebar
}) => {
  const getTabLabel = (id: string) => {
    switch (id) {
      case 'dashboard': return 'Emergency Command Center';
      case 'queue': return 'Priority Queue & Triage';
      case 'planner': return 'Emergency Route Planner';
      case 'map': return 'Hospital Campus Map';
      case 'algorithms': return 'Algorithm Engine & Comparison';
      case 'analytics': return 'Operations & Route Analytics';
      case 'about': return 'About & DAA Documentation';
      default: return 'Command Center';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Upper Status Ribbon */}
      <div className="px-4 lg:px-6 py-1.5 bg-[#050811] border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>12 LOCATIONS</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>18 CORRIDORS</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{blockedCount} BLOCKED</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{emergencyCount} IN QUEUE</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden md:inline">Python 3 + Dijkstra &amp; BFS</span>
          <span className="text-[10px] text-cyan-400/80 font-mono">PORT 3000 DEV</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Open Navigation & Operations Sidebar"
            >
              <Menu className="w-5 h-5 text-cyan-400" />
            </button>
          )}

          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono hidden sm:inline">RapidRoute+</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
            <h1 className="text-sm sm:text-base font-bold text-white font-sans tracking-tight">
              {getTabLabel(currentTab)}
            </h1>
          </div>
        </div>

        {/* Right: Quick Hackathon Demo & Emergency Dispatch simulation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartHackathonDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-600/20 transition-all cursor-pointer ring-1 ring-purple-400/30 active:scale-95"
            title="Launch guided 60-second hackathon demonstration for judges"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="whitespace-nowrap">🎬 Hackathon Demo</span>
          </button>

          <button
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95 ${
              isSimulating
                ? 'bg-rose-900/50 text-rose-300 border border-rose-800 cursor-wait'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 ring-1 ring-rose-400/30'
            }`}
            title="Trigger highest-priority emergency dispatch simulation"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap hidden sm:inline">
              {isSimulating ? 'Routing...' : '🚨 Simulate Emergency'}
            </span>
            <span className="whitespace-nowrap sm:hidden">Simulate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
