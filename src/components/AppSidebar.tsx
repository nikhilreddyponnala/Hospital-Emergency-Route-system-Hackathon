import React, { useState } from 'react';
import { EmergencyCase } from '../types/hospital';
import { RapidRouteLogo } from './RapidRouteLogo';
import {
  LayoutDashboard,
  Layers,
  Navigation,
  Map as MapIcon,
  GitCompare,
  BarChart3,
  BookOpen,
  Ambulance,
  Building2,
  GitBranch,
  MapPin,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Play,
  UserPlus,
  Flame,
  ChevronDown,
  ChevronUp,
  X,
  Activity
} from 'lucide-react';

interface AppSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  emergencies: EmergencyCase[];
  nextEmergency: EmergencyCase | null;
  onDispatchEmergency: (emergency: EmergencyCase) => void;
  onOpenAddModal: () => void;
  blockedCorridors: string[];
  onToggleCorridor: (corridorKey: string) => void;
  isDispatching?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onSelectTab,
  emergencies,
  nextEmergency,
  onDispatchEmergency,
  onOpenAddModal,
  blockedCorridors,
  onToggleCorridor,
  isDispatching = false,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [showLogoMeaning, setShowLogoMeaning] = useState<boolean>(true);
  const [showCorridorToggles, setShowCorridorToggles] = useState<boolean>(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'queue', label: 'Emergency Queue', icon: <Layers className="w-4 h-4" />, badge: `${emergencies.length}` },
    { id: 'planner', label: 'Route Planner', icon: <Navigation className="w-4 h-4" />, badge: 'DAA' },
    { id: 'map', label: 'Hospital Map', icon: <MapIcon className="w-4 h-4" />, badge: '12 Depts' },
    { id: 'algorithms', label: 'Algorithms & DAA', icon: <GitCompare className="w-4 h-4" />, badge: null },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, badge: null },
    { id: 'about', label: 'About & Documentation', icon: <BookOpen className="w-4 h-4" />, badge: null }
  ];

  const logoMeanings = [
    {
      icon: <Ambulance className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      title: 'Ambulance',
      desc: 'Emergency response & speed'
    },
    {
      icon: <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
      title: 'Hospital',
      desc: 'Care, treatment & safety'
    },
    {
      icon: <GitBranch className="w-3.5 h-3.5 text-teal-400 shrink-0" />,
      title: 'Path / Route',
      desc: 'Finding fastest & safest way'
    },
    {
      icon: <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
      title: 'Location Pin',
      desc: 'Navigation, positioning & guidance'
    },
    {
      icon: <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
      title: 'Heartbeat',
      desc: 'Saving lives, critical care & urgency'
    }
  ];

  const quickCorridors = [
    { key: 'Emergency Department|ICU', label: 'ED ↔ ICU (Direct Express)' },
    { key: 'Diagnostics Lab|ICU', label: 'Diagnostics ↔ ICU (Skybridge)' },
    { key: 'Operation Theatre|ICU', label: 'OT ↔ ICU (Post-Op Corridor)' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Persistent Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[320px] sm:w-[360px] lg:w-[360px] xl:w-[380px] bg-[#090d16] border-r border-slate-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="p-4 border-b border-slate-800 bg-[#070b13] flex items-center justify-between">
          <RapidRouteLogo
            variant="compact"
            onClick={() => {
              onSelectTab('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
          />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
          {/* Brand Tagline & Value Banner */}
          <div className="p-3 rounded-xl bg-[#0d1424] border border-cyan-500/20 space-y-1.5">
            <div className="text-[11px] font-black tracking-wider text-cyan-400 uppercase font-sans">
              SMARTER ROUTES. SAVING LIVES.
            </div>
            <div className="text-[11px] text-slate-300">
              Hospital Emergency Route System
            </div>
            <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10.5px]">
              <span className="text-emerald-400 font-bold">✓ Fast. Smart. Reliable.</span>
              <span className="text-slate-400 font-mono">Every second counts.</span>
            </div>
          </div>

          {/* Primary Navigation Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-2 mb-1.5">
              NAVIGATION &amp; OPERATIONS
            </div>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-slate-950' : 'text-cyan-400'}>
                      {item.icon}
                    </span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-slate-950 text-cyan-300'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Emergency Priority Queue Quick Spotlight */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Flame className="w-4 h-4 fill-rose-500" />
                <span className="text-[11px] uppercase tracking-wider">Priority Queue (Min-Heap)</span>
              </div>
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] cursor-pointer"
                title="Admit new patient"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ Admit</span>
              </button>
            </div>

            {nextEmergency ? (
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-rose-900/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-rose-400">
                    NEXT: {nextEmergency.patient_id}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    {nextEmergency.severity}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {nextEmergency.patient_name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {nextEmergency.start} → <strong className="text-cyan-400">{nextEmergency.destination}</strong>
                </div>
                <button
                  onClick={() => onDispatchEmergency(nextEmergency)}
                  disabled={isDispatching}
                  className="w-full mt-1 py-1.5 px-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10.5px] flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{isDispatching ? 'Routing...' : 'Route Emergency'}</span>
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 text-center py-1">
                Queue is empty.
              </div>
            )}
          </div>

          {/* Meaning Behind the Logo (Collapsible Accordion) */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div
              onClick={() => setShowLogoMeaning(!showLogoMeaning)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Meaning Behind Logo</span>
              </div>
              <button className="text-slate-400 hover:text-white">
                {showLogoMeaning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showLogoMeaning && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {logoMeanings.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-[#080d19] border border-slate-800/80 flex items-center gap-2"
                  >
                    {m.icon}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-[10.5px] leading-tight">{m.title}</div>
                      <div className="text-[9.5px] text-slate-400 truncate">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Corridor Hazard Toggles (On the Left Side) */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div
              onClick={() => setShowCorridorToggles(!showCorridorToggles)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Corridor Blockages</span>
              </div>
              <button className="text-slate-400 hover:text-white">
                {showCorridorToggles ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showCorridorToggles && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {quickCorridors.map((c) => {
                  const isBlocked = blockedCorridors.includes(c.key) ||
                    blockedCorridors.includes(c.key.replace('|', '::')) ||
                    blockedCorridors.includes(c.key.split('|').reverse().join('|'));

                  return (
                    <button
                      key={c.key}
                      onClick={() => onToggleCorridor(c.key)}
                      className={`w-full p-2 rounded-lg text-[10.5px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isBlocked
                          ? 'bg-rose-950/70 border-rose-600 text-rose-300 font-bold'
                          : 'bg-[#080d19] hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate pr-1">{c.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        isBlocked ? 'bg-rose-900 text-white' : 'bg-slate-800 text-emerald-400'
                      }`}>
                        {isBlocked ? '🛑 BLOCKED' : '🟢 OPEN'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#070b13] text-[10.5px] font-mono text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
          </div>
          <span className="text-cyan-400/80">DAA HACKATHON</span>
        </div>
      </aside>
    </>
  );
};
