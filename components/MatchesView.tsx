'use client';

import React from 'react';
import { Match } from '@/lib/types';
import { Heart, MessageCircle, MapPin, Sparkles, ExternalLink } from 'lucide-react';

interface MatchesViewProps {
  matches: Match[];
  onBackToFeed: () => void;
  isLoading: boolean;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onBackToFeed,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading your mutual matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-4 shadow-inner">
          <Heart className="w-9 h-9 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">No Matches Yet</h3>
        <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
          Mutual matches appear here when both you and someone else swipe right on each other.
        </p>
        <button
          onClick={onBackToFeed}
          className="py-2.5 px-6 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-600/20 transition-all hover:scale-105 active:scale-95"
        >
          Start Swiping on Discover
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Mutual Matches</h2>
          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30">
            {matches.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Zero-Knowledge Verified
        </div>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {matches.map((m) => {
          const formattedDate = new Date(m.matchedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const whatsappMessage = encodeURIComponent(
            `Hey ${m.profile.name}! Turns out we both swiped right on Coy 😉`
          );

          return (
            <div
              key={m.id}
              className="group p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-pink-500/40 transition-all duration-200 flex items-center gap-3.5 shadow-md"
            >
              {/* Profile Thumbnail */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700/60">
                <img
                  src={m.profile.photo}
                  alt={m.profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm" />
              </div>

              {/* Match Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {m.profile.name}, {m.profile.age}
                  </h4>
                  <span className="text-[10px] text-slate-500 flex-shrink-0">{formattedDate}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-rose-400 font-medium truncate mb-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{m.profile.cityOrCollege}</span>
                </div>

                <p className="text-[11px] text-slate-400 truncate leading-snug">
                  {m.profile.bio}
                </p>
              </div>

              {/* Action Button: WhatsApp Icebreaker */}
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Send WhatsApp Icebreaker"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 border border-slate-700/60 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
