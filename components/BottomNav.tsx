'use client';

import React from 'react';
import { Home, Compass, MessageCircleHeart } from 'lucide-react';

export type TabType = 'home' | 'discover' | 'matches';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  matchesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  matchesCount,
}) => {
  return (
    <nav className="w-full h-16 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-6 flex items-center justify-around flex-shrink-0 z-30">
      {/* Home Tab (Placeholder per assignment specification) */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition-all ${
          activeTab === 'home'
            ? 'text-pink-400 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] tracking-wide">Home</span>
      </button>

      {/* Discover Tab (Core Assignment Functionality) */}
      <button
        onClick={() => onTabChange('discover')}
        className={`flex flex-col items-center gap-1 transition-all relative ${
          activeTab === 'discover'
            ? 'text-pink-400 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <div className="relative">
          <Compass className="w-5 h-5" />
          {activeTab === 'discover' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          )}
        </div>
        <span className="text-[10px] tracking-wide">Discover</span>
      </button>

      {/* Matches Tab */}
      <button
        onClick={() => onTabChange('matches')}
        className={`flex flex-col items-center gap-1 transition-all relative ${
          activeTab === 'matches'
            ? 'text-pink-400 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <div className="relative">
          <MessageCircleHeart className="w-5 h-5" />
          {matchesCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[9px] font-extrabold shadow-sm">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-wide">Matches</span>
      </button>
    </nav>
  );
};
