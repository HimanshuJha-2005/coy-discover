'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200/90 p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle Accent Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-none" />
            Mutual match
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            It&apos;s a Match!
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            You and <span className="text-slate-800 font-semibold">{profile.name}</span> both liked each other on Coy.
          </p>

          {/* Overlapping Avatars */}
          <div className="flex items-center justify-center relative mb-6">
            {/* User Avatar */}
            <div className="w-20 h-20 rounded-full border-3 border-white shadow-md overflow-hidden bg-slate-100 -mr-3 z-10">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Coral Heart Badge */}
            <div className="w-9 h-9 rounded-full bg-[#FE3C72] flex items-center justify-center shadow-md shadow-rose-500/30 z-30 -mx-1">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>

            {/* Matched Profile Avatar */}
            <div className="w-20 h-20 rounded-full border-3 border-white shadow-md overflow-hidden bg-slate-100 -ml-3 z-20">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Card Summary */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-6">
            <div className="text-sm font-bold text-slate-900 mb-0.5">{profile.name}, {profile.age}</div>
            <div className="text-xs text-rose-600 font-medium">{profile.cityOrCollege}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onViewMatches}
              className="w-full py-3.5 px-4 rounded-xl bg-[#FE3C72] hover:bg-[#E11D48] text-white font-semibold text-sm shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              View Mutual Matches
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs border border-slate-200/60 transition-all active:scale-98"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
