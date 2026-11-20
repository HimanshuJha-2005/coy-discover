'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Heart, X as XIcon } from 'lucide-react';
import { Profile } from '@/lib/types';

interface CardProps {
  profile: Profile;
  onSwipe: (action: 'LIKE' | 'PASS') => void;
  isFront: boolean;
}

export const Card: React.FC<CardProps> = ({ profile, onSwipe, isFront }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-16, 0, 16]);
  
  // Dynamic opacity for LIKE / PASS stamps
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -120], [0, 1]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.96, 1, 0.96]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('LIKE');
    } else if (info.offset.x < -threshold) {
      onSwipe('PASS');
    }
  };

  if (!isFront) {
    // Background card in the deck for natural stacking depth
    return (
      <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-slate-200 scale-95 translate-y-3 pointer-events-none opacity-60 transition-all duration-300">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate, scale: cardScale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] bg-slate-900 border border-slate-200/90 cursor-grab active:cursor-grabbing select-none"
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
        className="absolute top-7 left-7 border-2 border-emerald-500 bg-white/95 backdrop-blur-sm text-emerald-600 font-bold text-xl tracking-wider px-3.5 py-1 rounded-xl -rotate-12 pointer-events-none z-20 flex items-center gap-1.5 shadow-md"
      >
        <Heart className="w-5 h-5 fill-emerald-500 stroke-none" />
        LIKE
      </motion.div>

      {/* PASS Badge Stamp */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-7 right-7 border-2 border-rose-500 bg-white/95 backdrop-blur-sm text-rose-600 font-bold text-xl tracking-wider px-3.5 py-1 rounded-xl rotate-12 pointer-events-none z-20 flex items-center gap-1.5 shadow-md"
      >
        <XIcon className="w-5 h-5 stroke-[2.5]" />
        PASS
      </motion.div>

      {/* Bottom Gradient Overlay & Profile Details */}
      <div className="absolute inset-x-0 bottom-0 pt-24 pb-6 px-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h2>
          <span className="text-xl font-normal text-white/80">{profile.age}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium mb-2.5">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{profile.cityOrCollege}</span>
        </div>

        <p className="text-sm text-white/90 line-clamp-3 mb-3.5 leading-relaxed font-normal">
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/20"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
