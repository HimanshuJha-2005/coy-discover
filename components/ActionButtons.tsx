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
    <div className="flex flex-col items-center gap-2 py-4 px-6 bg-white border-t border-slate-100 flex-shrink-0">
      <div className="flex items-center justify-center gap-6">
        {/* Pass Button */}
        <button
          onClick={onPass}
          disabled={disabled}
          aria-label="Pass"
          className="w-14 h-14 rounded-full bg-white border border-slate-200 text-rose-500 flex items-center justify-center shadow-sm hover:bg-rose-50/50 hover:border-rose-300 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
        >
          <XIcon className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Reset Demo Button */}
        {onReset && (
          <button
            onClick={onReset}
            disabled={disabled}
            aria-label="Reset Demo"
            title="Reset Demo State"
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/80 text-slate-400 flex items-center justify-center shadow-xs hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Like Button */}
        <button
          onClick={onLike}
          disabled={disabled}
          aria-label="Like"
          className="w-14 h-14 rounded-full bg-[#FE3C72] text-white flex items-center justify-center shadow-md shadow-rose-500/20 hover:bg-[#E11D48] hover:shadow-rose-500/35 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Heart className="w-6 h-6 fill-white stroke-none" />
        </button>
      </div>

      <span className="text-[11px] text-slate-400 font-medium">
        Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[10px]">←</kbd> Pass &nbsp;•&nbsp; <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[10px]">→</kbd> Like
      </span>
    </div>
  );
};
