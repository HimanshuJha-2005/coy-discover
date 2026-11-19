'use client';

import React from 'react';
import { RotateCcw, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn select-none">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-pink-400 shadow-2xl">
          <Compass className="w-10 h-10 animate-pulse stroke-[1.5]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">
        You&apos;ve Seen Everyone!
      </h3>
      
      <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
        You have swiped through all available profiles in your circle. Swiped profiles are permanently filtered per Coy&apos;s privacy invariant.
      </p>

      {matchesCount > 0 && (
        <div className="w-full max-w-xs bg-slate-900/80 border border-pink-500/30 rounded-2xl p-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <div>
              <div className="text-xs font-bold text-white">{matchesCount} Mutual Matches</div>
              <div className="text-[10px] text-slate-400">Waiting in your matches tab</div>
            </div>
          </div>
          <button
            onClick={onViewMatches}
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 py-1 px-2.5 rounded-lg bg-pink-500/10 border border-pink-500/20 transition-all"
          >
            View
          </button>
        </div>
      )}

      {/* Reset Demo Button */}
      <button
        onClick={onReset}
        disabled={isResetting}
        className="w-full max-w-xs py-3 px-5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        {isResetting ? 'Resetting Demo...' : 'Reset Demo Deck (30 Profiles)'}
      </button>

      <p className="text-[10px] text-slate-500 mt-3 font-normal">
        Clears local swipes table &amp; re-initializes seeded test users.
      </p>
    </div>
  );
};
