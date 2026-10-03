import React, { useState } from 'react';
import { HospitalNode, SeverityLevel } from '../types/hospital';
import { X, UserPlus, Flame, AlertTriangle } from 'lucide-react';

interface AddEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: HospitalNode[];
  onAddEmergency: (data: {
    patient_id: string;
    patient_name: string;
    patient_type: string;
    start: string;
    destination: string;
    severity: SeverityLevel;
    arrival_time: string;
    notes: string;
  }) => Promise<void>;
}

export const AddEmergencyModal: React.FC<AddEmergencyModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onAddEmergency
}) => {
  const [patientId, setPatientId] = useState<string>(`EMR-${Math.floor(100 + Math.random() * 900)}`);
  const [patientName, setPatientName] = useState<string>('');
  const [patientType, setPatientType] = useState<string>('Acute Stroke / Hemorrhage');
  const [start, setStart] = useState<string>('Emergency Gate');
  const [destination, setDestination] = useState<string>('ICU');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [arrivalTime, setArrivalTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddEmergency({
        patient_id: patientId,
        patient_name: patientName,
        patient_type: patientType,
        start,
        destination,
        severity,
        arrival_time: arrivalTime,
        notes: notes || 'Admitted via Triage Command.'
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-sans">Admit Emergency Patient</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Arrival Time (24h)</label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                placeholder="08:35"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Patient Full Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Jonathan Drake (Age 64)"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Clinical Presentation / Diagnosis</label>
            <input
              type="text"
              value={patientType}
              onChange={(e) => setPatientType(e.target.value)}
              placeholder="e.g. Acute STEMI, Tension Pneumothorax"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          {/* Severity Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Triage Severity Rank</label>
            <div className="grid grid-cols-4 gap-2">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as SeverityLevel[]).map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? sev === 'CRITICAL'
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : sev === 'HIGH'
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : sev === 'MEDIUM'
                          ? 'bg-blue-950 border-blue-500 text-blue-300'
                          : 'bg-slate-800 border-slate-600 text-slate-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Pickup / Origin</label>
              <select
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white cursor-pointer"
              >
                {nodes.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Clinical Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white cursor-pointer"
              >
                {nodes.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Triage Clinical Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Vitals, allergies, priority rationale..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              {isSubmitting ? 'Inserting into Min-Heap...' : 'Insert into Priority Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
