import React, { useState } from 'react';
import { EmergencyCase, SeverityLevel, HospitalNode } from '../types/hospital';
import { RapidRouteLogo } from './RapidRouteLogo';
import { EmergencyQueuePanel } from './EmergencyQueuePanel';
import {
  Ambulance,
  Building2,
  GitBranch,
  MapPin,
  HeartPulse,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface CommandCenterSidebarProps {
  emergencies: EmergencyCase[];
  nextEmergency: EmergencyCase | null;
  onDispatchEmergency: (emergency: EmergencyCase) => void;
  onOpenAddModal: () => void;
  isDispatching?: boolean;
  blockedCorridors: string[];
  onToggleCorridor: (corridorKey: string) => void;
}

export const CommandCenterSidebar: React.FC<CommandCenterSidebarProps> = ({
  emergencies,
  nextEmergency,
  onDispatchEmergency,
  onOpenAddModal,
  isDispatching = false,
  blockedCorridors,
  onToggleCorridor
}) => {
  const [showLogoMeaning, setShowLogoMeaning] = useState<boolean>(true);
  const [showCorridorToggles, setShowCorridorToggles] = useState<boolean>(true);

  const logoMeanings = [
    {
      icon: <Ambulance className="w-4 h-4 text-rose-400 shrink-0" />,
      title: 'Ambulance',
      description: 'Emergency response & speed',
      color: 'border-rose-500/30 bg-rose-500/5'
    },
    {
      icon: <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />,
      title: 'Hospital',
      description: 'Care, treatment & safety',
      color: 'border-cyan-500/30 bg-cyan-500/5'
    },
    {
      icon: <GitBranch className="w-4 h-4 text-teal-400 shrink-0" />,
      title: 'Path / Route',
      description: 'Finding the fastest safe way',
      color: 'border-teal-500/30 bg-teal-500/5'
    },
    {
      icon: <MapPin className="w-4 h-4 text-blue-400 shrink-0" />,
      title: 'Location Pin',
      description: 'Navigation, positioning & guidance',
      color: 'border-blue-500/30 bg-blue-500/5'
    },
    {
      icon: <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />,
      title: 'Heartbeat',
      description: 'Saving lives, critical care & urgency',
      color: 'border-rose-600/30 bg-rose-600/5'
    }
  ];

  const quickCorridors = [
    { key: 'Emergency Department|ICU', label: 'ED ↔ ICU (Direct Express)' },
    { key: 'Diagnostics Lab|ICU', label: 'Diagnostics ↔ ICU (Skybridge)' },
    { key: 'Operation Theatre|ICU', label: 'OT ↔ ICU (Post-Op Transit)' }
  ];

  return (
    <div className="space-y-5">
      {/* 1. Official App Identity & Slogan Card */}
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-4 shadow-xl space-y-3">
        <RapidRouteLogo variant="full" />

        {/* Value Proposition Badge from user's attached design */}
        <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Fast. Smart. Reliable.</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">
            Because <strong className="text-cyan-400 font-semibold">every second</strong> counts.
          </span>
        </div>
      </div>

      {/* 2. Meaning Behind the Logo (From attached design) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div 
          onClick={() => setShowLogoMeaning(!showLogoMeaning)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Meaning Behind the Logo
            </h3>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {showLogoMeaning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showLogoMeaning && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            {logoMeanings.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex items-center gap-2.5 text-xs transition-colors ${item.color}`}
              >
                {item.icon}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[11.5px] leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[10.5px] text-slate-400 truncate">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Emergency Priority Queue (Min-Heap) */}
      <EmergencyQueuePanel
        emergencies={emergencies}
        nextEmergency={nextEmergency}
        onDispatchEmergency={onDispatchEmergency}
        onOpenAddModal={onOpenAddModal}
        isDispatching={isDispatching}
      />

      {/* 4. Corridor Blockage Quick Controls (On the Left Side) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div 
          onClick={() => setShowCorridorToggles(!showCorridorToggles)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Corridor Hazard Controls
            </h3>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {showCorridorToggles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showCorridorToggles && (
          <div className="space-y-2 pt-1 text-xs animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Toggle corridors to simulate blockages. Dijkstra instantly recalibrates the detour route.
            </p>
            <div className="space-y-1.5">
              {quickCorridors.map((c) => {
                const isBlocked = blockedCorridors.includes(c.key) ||
                  blockedCorridors.includes(c.key.replace('|', '::')) ||
                  blockedCorridors.includes(c.key.split('|').reverse().join('|'));

                return (
                  <button
                    key={c.key}
                    onClick={() => onToggleCorridor(c.key)}
                    className={`w-full p-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isBlocked
                        ? 'bg-rose-950/70 border-rose-600 text-rose-300 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isBlocked ? 'bg-rose-900 text-white' : 'bg-slate-800 text-emerald-400'
                    }`}>
                      {isBlocked ? '🛑 BLOCKED' : '🟢 OPEN'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
