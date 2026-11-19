'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Sparkles, Heart, X as XIcon } from 'lucide-react';
import { Profile } from '@/lib/types';

interface CardProps {
  profile: Profile;
  onSwipe: (action: 'LIKE' | 'PASS') => void;
  isFront: boolean;
}

export const Card: React.FC<CardProps> = ({ profile, onSwipe, isFront }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  
  // Dynamic opacity for LIKE / NOPE badges
  const likeOpacity = useTransform(x, [40, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -130], [0, 1]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('LIKE');
    } else if (info.offset.x < -threshold) {
      onSwipe('PASS');
    }
  };

  if (!isFront) {
    // Background card in the deck (scaled down slightly for depth)
    return (
      <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800 scale-95 translate-y-3 pointer-events-none opacity-60 transition-all duration-300">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate, scale: cardScale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Profile Photo */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* LIKE Badge Stamp */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 border-4 border-emerald-400 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 font-extrabold text-2xl tracking-widest px-4 py-1 rounded-xl -rotate-12 pointer-events-none z-20 flex items-center gap-1.5 shadow-lg"
      >
        <Heart className="w-6 h-6 fill-emerald-400" />
        LIKE
      </motion.div>

      {/* NOPE Badge Stamp */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 border-4 border-rose-500 bg-rose-500/20 backdrop-blur-sm text-rose-500 font-extrabold text-2xl tracking-widest px-4 py-1 rounded-xl rotate-12 pointer-events-none z-20 flex items-center gap-1.5 shadow-lg"
      >
        <XIcon className="w-6 h-6 stroke-[3]" />
        PASS
      </motion.div>

      {/* Bottom Gradient Overlay & Profile Details */}
      <div className="absolute inset-x-0 bottom-0 pt-24 pb-6 px-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h2>
          <span className="text-xl font-medium text-slate-300">{profile.age}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{profile.cityOrCollege}</span>
        </div>

        <p className="text-sm text-slate-200 line-clamp-3 mb-3.5 leading-relaxed font-normal">
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-300 border border-slate-700/60"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
