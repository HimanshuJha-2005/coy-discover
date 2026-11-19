'use client';

import React from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  isResetting?: boolean;
  remainingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  isResetting = false,
  remainingCount,
}) => {
  return (
    <header className="w-full h-14 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-5 flex items-center justify-between flex-shrink-0 z-30">
      {/* Brand Logo */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-black tracking-tight text-white font-mono">
          coy<span className="text-pink-500">.</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 ml-1">
          Discover
        </span>
      </div>

      {/* Center Privacy Badge */}
      <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
        <ShieldCheck className="w-3.5 h-3.5" />
        Zero-Leak Invariant
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {remainingCount > 0 && (
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
            {remainingCount} left
          </span>
        )}

        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset Demo State"
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
