'use client';

import React from 'react';
import { Match } from '@/lib/types';
import { Heart, MessageCircle, MapPin } from 'lucide-react';

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
        <div className="w-8 h-8 border-3 border-rose-200 border-t-[#FE3C72] rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500">Loading your mutual matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-xs">
          <Heart className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No matches yet</h3>
        <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
          Mutual matches appear here when someone in your circle also swipes right on you.
        </p>
        <button
          onClick={onBackToFeed}
          className="py-2 px-5 rounded-full bg-[#FE3C72] hover:bg-[#E11D48] text-white text-xs font-semibold shadow-sm transition-all"
        >
          Explore Discover Feed
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-slate-200/70 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mutual Matches</h2>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200/80">
            {matches.length}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Double-blind verified</span>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
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
              className="group p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-300 transition-all duration-150 flex items-center gap-3.5 shadow-xs"
            >
              {/* Profile Thumbnail */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/60">
                <img
                  src={m.profile.photo}
                  alt={m.profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>

              {/* Match Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {m.profile.name}, {m.profile.age}
                  </h4>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{formattedDate}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium truncate mb-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{m.profile.cityOrCollege}</span>
                </div>

                <p className="text-[11px] text-slate-500 truncate leading-snug">
                  {m.profile.bio}
                </p>
              </div>

              {/* Action Button: WhatsApp Icebreaker */}
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Send WhatsApp Message"
                className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
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
