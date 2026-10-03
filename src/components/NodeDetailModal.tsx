import React from 'react';
import { HospitalNode } from '../types/hospital';
import { X, Building2, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface NodeDetailModalProps {
  node: HospitalNode | null;
  onClose: () => void;
  onSetStart: (name: string) => void;
  onSetDestination: (name: string) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onSetStart,
  onSetDestination
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <Building2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-white font-sans">{node.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">WING / BUILDING</span>
              <span className="font-semibold text-slate-200">{node.wing}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">FLOOR LEVEL</span>
              <span className="font-semibold text-slate-200">{node.floor}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 font-mono block">ACTIVE CAPACITY</span>
            <span className="font-mono text-cyan-400 font-bold">{node.capacity}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold text-[11px]">Department Function</span>
            <p className="text-slate-300 leading-relaxed text-[11.5px] bg-[#080d19] p-3 rounded-lg border border-slate-800">
              {node.description}
            </p>
          </div>

          {/* Quick Route Setup Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSetStart(node.name);
                onClose();
              }}
              className="py-2.5 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-xs cursor-pointer transition-colors"
            >
              Set as Origin 🔵
            </button>
            <button
              onClick={() => {
                onSetDestination(node.name);
                onClose();
              }}
              className="py-2.5 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs cursor-pointer transition-colors"
            >
              Set as Destination 🔴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
