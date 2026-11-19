'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Profile } from '@/lib/types';

interface MatchModalProps {
  isOpen: boolean;
  profile: Profile | null;
  onClose: () => void;
  onViewMatches: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  profile,
  onClose,
  onViewMatches,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-pink-500/30 p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Background Ambient Glows */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Double-Blind Mutual Crush
          </div>

          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent mb-1">
            It&apos;s a Match!
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            You and <span className="text-slate-200 font-semibold">{profile.name}</span> secretly liked each other on Coy.
          </p>

          {/* Overlapping Avatars */}
          <div className="flex items-center justify-center relative mb-6">
            {/* User Avatar */}
            <div className="w-20 h-20 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden bg-slate-800 -mr-3 z-10">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Glowing Heart Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/50 z-30 -mx-2">
              <Heart className="w-5 h-5 fill-white text-white animate-bounce" />
            </div>

            {/* Matched Profile Avatar */}
            <div className="w-20 h-20 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden bg-slate-800 -ml-3 z-20">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-3 border border-slate-700/50 mb-6">
            <div className="text-sm font-bold text-white mb-0.5">{profile.name}, {profile.age}</div>
            <div className="text-xs text-rose-400 font-medium">{profile.cityOrCollege}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onViewMatches}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              View Mutual Matches
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-700/60 transition-all active:scale-98"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
