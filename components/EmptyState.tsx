'use client';

import React from 'react';
import { RotateCcw, Compass, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  matchesCount: number;
  onViewMatches: () => void;
  isResetting?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  matchesCount,
  onViewMatches,
  isResetting = false,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-slate-50">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-[#FE3C72] shadow-xs">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
        You&apos;ve seen everyone
      </h3>
      
      <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
        You have swiped through all available profiles in your circle. Swiped candidates are permanently excluded.
      </p>

      {matchesCount > 0 && (
        <div className="w-full max-w-xs bg-white border border-slate-200/80 shadow-xs rounded-2xl p-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-2 h-2 rounded-full bg-[#FE3C72]" />
            <div>
              <div className="text-xs font-bold text-slate-900">{matchesCount} Mutual Matches</div>
              <div className="text-[10px] text-slate-500">Waiting in your matches tab</div>
            </div>
          </div>
          <button
            onClick={onViewMatches}
            className="text-xs font-semibold text-[#FE3C72] hover:text-[#E11D48] py-1 px-2.5 rounded-lg bg-rose-50 border border-rose-200/60 transition-all"
          >
            View
          </button>
        </div>
      )}

      {/* Reset Demo Button */}
      <button
        onClick={onReset}
        disabled={isResetting}
        className="w-full max-w-xs py-3 px-5 rounded-xl bg-[#FE3C72] hover:bg-[#E11D48] text-white font-semibold text-xs shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        {isResetting ? 'Resetting Demo...' : 'Reset Demo Deck (30 Profiles)'}
      </button>

      <p className="text-[10px] text-slate-400 mt-3 font-normal">
        Clears local swipes table &amp; restores seeded candidates.
      </p>
    </div>
  );
};
