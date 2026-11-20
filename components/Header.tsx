'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

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
    <header className="w-full h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-5 flex items-center justify-between flex-shrink-0 z-30">
      {/* Brand Logo */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          coy<span className="text-[#FE3C72]">.</span>
        </span>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full ml-1">
          Discover
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {remainingCount > 0 && (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
            {remainingCount} left
          </span>
        )}

        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset Demo State"
          aria-label="Reset Demo State"
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-40"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
