'use client';

import React from 'react';
import { Heart, X as XIcon, RotateCcw } from 'lucide-react';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onReset?: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPass,
  onLike,
  onReset,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 py-4 px-6 bg-slate-950/60 backdrop-blur-md">
      <div className="flex items-center justify-center gap-6">
        {/* Pass Button */}
        <button
          onClick={onPass}
          disabled={disabled}
          aria-label="Pass"
          className="w-14 h-14 rounded-full bg-slate-900 border-2 border-rose-500/40 text-rose-500 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-rose-500/10 hover:border-rose-500 disabled:opacity-40 disabled:pointer-events-none"
        >
          <XIcon className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Reset Demo Button */}
        {onReset && (
          <button
            onClick={onReset}
            disabled={disabled}
            aria-label="Reset Demo"
            title="Reset Demo State"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/60 text-slate-400 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 hover:text-white hover:border-slate-500 disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Like Button */}
        <button
          onClick={onLike}
          disabled={disabled}
          aria-label="Like"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-600/30 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-pink-600/50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Heart className="w-7 h-7 fill-white stroke-none" />
        </button>
      </div>

      <span className="text-[11px] text-slate-500 font-medium">
        Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">←</kbd> Pass &nbsp;•&nbsp; <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">→</kbd> Like
      </span>
    </div>
  );
};
