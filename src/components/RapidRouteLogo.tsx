import React from 'react';
import logoImg from '../assets/images/rapidroute_logo_1791011968061.jpg';

interface RapidRouteLogoProps {
  variant?: 'header' | 'full' | 'hero' | 'compact';
  className?: string;
  onClick?: () => void;
}

export const RapidRouteLogo: React.FC<RapidRouteLogoProps> = ({
  variant = 'header',
  className = '',
  onClick
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 cursor-pointer ${className}`} onClick={onClick}>
        <img
          src={logoImg}
          alt="RapidRoute+ Logo"
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/30 shadow-md shadow-cyan-500/10"
        />
        <div className="flex items-center">
          <span className="text-base font-extrabold text-white tracking-tight">Rapid</span>
          <span className="text-base font-extrabold text-cyan-400 tracking-tight">Route</span>
          <span className="text-base font-extrabold text-rose-500 ml-0.5">+</span>
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-3 cursor-pointer group ${className}`} onClick={onClick}>
        {/* Logo App Icon Mark with ambient cyan glow */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-rose-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
          <img
            src={logoImg}
            alt="RapidRoute+ Logo"
            referrerPolicy="no-referrer"
            className="relative w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-400/40 shadow-lg"
          />
        </div>

        {/* Brand Typography matching the uploaded official branding */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <span className="text-xl font-black tracking-tight text-white font-sans">
              Rapid
            </span>
            <span className="text-xl font-black tracking-tight text-cyan-400 font-sans">
              Route
            </span>
            <span className="text-xl font-black text-rose-500 ml-0.5">
              +
            </span>
            {/* ECG Heartbeat pulse line */}
            <svg className="w-12 h-4 ml-1.5 text-rose-500 inline-block overflow-visible" viewBox="0 0 50 16">
              <path
                d="M 0 8 L 14 8 L 18 2 L 23 14 L 27 5 L 31 10 L 34 8 L 50 8"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold text-slate-400">
            <span className="text-slate-300">SMARTER ROUTES</span>
            <span className="text-rose-500">·</span>
            <span className="text-slate-300">SAVING LIVES</span>
          </div>
        </div>
      </div>
    );
  }

  // Full & Hero Variant (For Landing & About views)
  return (
    <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 ${className}`} onClick={onClick}>
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-rose-500 rounded-2xl blur-md opacity-40" />
        <img
          src={logoImg}
          alt="RapidRoute+ Hospital Emergency Route System"
          referrerPolicy="no-referrer"
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-2xl"
        />
      </div>

      <div className="text-center sm:text-left space-y-1">
        <div className="flex items-center justify-center sm:justify-start">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
            Rapid
          </span>
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-cyan-400 font-sans">
            Route
          </span>
          <span className="text-3xl sm:text-4xl font-black text-rose-500 ml-1">
            +
          </span>

          {/* ECG Pulse */}
          <svg className="w-16 h-6 ml-2 text-rose-500 hidden sm:inline-block overflow-visible" viewBox="0 0 60 20">
            <path
              d="M 0 10 L 16 10 L 22 2 L 28 18 L 33 6 L 38 13 L 42 10 L 60 10"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-300">
          SMARTER ROUTES. SAVING LIVES.
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Hospital Emergency Route System
        </div>

        {/* Value Proposition Badge from attached graphic */}
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-[11px] text-cyan-200">
          <span className="text-emerald-400 font-bold">✓ Fast. Smart. Reliable.</span>
          <span className="text-slate-600">·</span>
          <span>Because <strong className="text-cyan-400">every second</strong> counts.</span>
        </div>
      </div>
    </div>
  );
};
