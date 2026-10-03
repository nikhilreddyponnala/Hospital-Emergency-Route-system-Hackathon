import React, { useState } from 'react';
import { EmergencyCase, SeverityLevel } from '../types/hospital';
import {
  Flame,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  UserPlus,
  Play,
  Layers,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface EmergencyQueuePanelProps {
  emergencies: EmergencyCase[];
  nextEmergency: EmergencyCase | null;
  onDispatchEmergency: (emergency: EmergencyCase) => void;
  onOpenAddModal: () => void;
  isDispatching?: boolean;
}

export const EmergencyQueuePanel: React.FC<EmergencyQueuePanelProps> = ({
  emergencies,
  nextEmergency,
  onDispatchEmergency,
  onOpenAddModal,
  isDispatching = false
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [showHeapTree, setShowHeapTree] = useState<boolean>(false);

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 fill-rose-500" /> CRITICAL (P1)
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> HIGH (P2)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
            MEDIUM (P3)
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-700">
            LOW (P4)
          </span>
        );
      default:
        return null;
    }
  };

  const filteredEmergencies = emergencies.filter(em => {
    if (filterSeverity === 'ALL') return true;
    return em.severity === filterSeverity;
  });

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header with Title and Add Case Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white font-sans">Emergency Priority Queue</h2>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-cyan-400 font-semibold border border-slate-700">
              Binary Min-Heap
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-sorted by clinical severity rank (Critical 1 → Low 4) and arrival timestamp tiebreaker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHeapTree(!showHeapTree)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="Inspect Heap Array Structure"
          >
            {showHeapTree ? 'Hide Heap Tree' : 'Inspect Heap Tree'}
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-600/20 transition-all cursor-pointer active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit Emergency</span>
          </button>
        </div>
      </div>

      {/* Spotlight: Next Emergency to Process */}
      {nextEmergency ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-[#1e1329] to-slate-900 border border-rose-500/40 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-extrabold text-[10px] tracking-wider uppercase animate-pulse">
                  ⚡ NEXT IN QUEUE (MIN-HEAP ROOT)
                </span>
                <span className="font-mono text-xs text-rose-300 font-semibold">{nextEmergency.patient_id}</span>
              </div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{nextEmergency.patient_name}</span>
                <span className="text-xs font-normal text-slate-400">· {nextEmergency.patient_type}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 pt-0.5">
                <div className="flex items-center gap-1 text-cyan-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{nextEmergency.start}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="text-rose-400 font-bold">{nextEmergency.destination}</span>
                </div>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-1 text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Arrived {nextEmergency.arrival_time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:self-center">
              <div>{getSeverityBadge(nextEmergency.severity)}</div>
              <button
                onClick={() => onDispatchEmergency(nextEmergency)}
                disabled={isDispatching}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isDispatching ? 'Routing...' : 'Route Patient'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
          No emergencies currently in queue. Click &quot;Admit Emergency&quot; to register a patient.
        </div>
      )}

      {/* Heap Tree / Array Structure Inspector */}
      {showHeapTree && (
        <div className="p-3.5 rounded-xl bg-[#090e1a] border border-cyan-800/40 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono font-semibold">
            <span>Binary Min-Heap Array Representation</span>
            <span>Invariant: Parent[i] ≤ Left[2i+1], Right[2i+2]</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-[11px]">
            {emergencies.map((em, idx) => (
              <div
                key={em.id}
                className={`p-2 rounded-lg border shrink-0 text-center ${
                  idx === 0
                    ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[9px] text-slate-500">Index [{idx}] {idx === 0 ? '(Root)' : ''}</div>
                <div className="font-bold">{em.patient_id}</div>
                <div className="text-[10px] text-cyan-400">{em.severity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg text-xs font-medium">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => {
          const count = sev === 'ALL'
            ? emergencies.length
            : emergencies.filter(e => e.severity === sev).length;
          const isActive = filterSeverity === sev;
          return (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-xs font-semibold ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev} ({count})
            </button>
          );
        })}
      </div>

      {/* Emergency Cases List */}
      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {filteredEmergencies.map((em, index) => {
          const isRoot = index === 0 && filterSeverity === 'ALL';
          return (
            <div
              key={em.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isRoot
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/40 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{em.patient_id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-semibold text-slate-200">{em.patient_name}</span>
                    <span className="text-xs text-slate-400">({em.patient_type})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1 text-slate-300">
                      <span className="text-slate-500">Route:</span>
                      <span className="text-cyan-400">{em.start}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600 inline" />
                      <span className="text-rose-400">{em.destination}</span>
                    </div>
                    <span className="text-slate-700">|</span>
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{em.arrival_time}</span>
                    </div>
                  </div>

                  {em.notes && (
                    <p className="text-[11px] text-slate-400 italic line-clamp-1">
                      &quot;{em.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                  <div>{getSeverityBadge(em.severity)}</div>
                  <button
                    onClick={() => onDispatchEmergency(em)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Plan route for this case"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
