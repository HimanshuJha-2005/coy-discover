'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Profile, Match } from '@/lib/types';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { ActionButtons } from '@/components/ActionButtons';
import { MatchModal } from '@/components/MatchModal';
import { MatchesView } from '@/components/MatchesView';
import { EmptyState } from '@/components/EmptyState';
import { BottomNav, TabType } from '@/components/BottomNav';
import { Heart, Sparkles, UserPlus } from 'lucide-react';

export default function CoyDiscoverApp() {
  const [feed, setFeed] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Load feed from backend API
  const fetchFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setFeed(data.profiles || []);
      }
    } catch (err) {
      console.error('Failed to fetch feed:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  // Load mutual matches from backend API
  const fetchMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // Handle Swipe Action (either via touch drag or button click)
  const handleSwipe = async (action: 'LIKE' | 'PASS') => {
    if (feed.length === 0) return;

    // Pop the current top profile optimistically
    const currentProfile = feed[0];
    setFeed((prev) => prev.slice(1));

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetProfileId: currentProfile.id,
          action,
        }),
      });

      const data = await res.json();

      if (data.success && data.isMatch) {
        setMatchedProfile(data.matchProfile || currentProfile);
        setShowMatchModal(true);
        fetchMatches(); // refresh matches count & list
      }
    } catch (err) {
      console.error('Error submitting swipe:', err);
    }
  };

  // Keyboard shortcut listeners (Left Arrow = Pass, Right Arrow = Like)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'discover' || feed.length === 0 || showMatchModal) return;
      if (e.key === 'ArrowLeft') {
        handleSwipe('PASS');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('LIKE');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, feed, showMatchModal]);

  // Reset Demo State (Clears swipes, re-seeds database)
  const handleReset = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      await Promise.all([fetchFeed(), fetchMatches()]);
      setActiveTab('discover');
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="w-full max-w-[420px] h-[100dvh] md:h-[860px] md:max-h-[92vh] bg-slate-950 md:rounded-[36px] border-0 md:border-2 md:border-slate-800/80 shadow-2xl flex flex-col overflow-hidden relative">
      {/* Top Application Header */}
      <Header
        onReset={handleReset}
        isResetting={isResetting}
        remainingCount={feed.length}
      />

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Tab 1: Home (Placeholder per assignment prompt) */}
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 shadow-lg">
              <UserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Coy Home Tab</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
              This tab is reserved for Coy&apos;s direct phone/email crush list. Per the assignment instructions, this tab is kept as a placeholder while the full swipe functionality is built in the <strong className="text-pink-400">Discover</strong> tab.
            </p>
            <button
              onClick={() => setActiveTab('discover')}
              className="py-2.5 px-6 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              Open Discover Feed ({feed.length} left)
            </button>
          </div>
        )}

        {/* Tab 2: Discover (Core Swipe Experience) */}
        {activeTab === 'discover' && (
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {isLoadingFeed ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4" />
                <p className="text-xs text-slate-400">Loading mock candidate profiles...</p>
              </div>
            ) : feed.length === 0 ? (
              <EmptyState
                onReset={handleReset}
                matchesCount={matches.length}
                onViewMatches={() => setActiveTab('matches')}
                isResetting={isResetting}
              />
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Card Stack Deck Area */}
                <div className="flex-1 relative m-3 sm:m-4">
                  {/* Background card preview for depth */}
                  {feed.length > 1 && (
                    <Card
                      key={feed[1].id}
                      profile={feed[1]}
                      onSwipe={() => {}}
                      isFront={false}
                    />
                  )}

                  {/* Active Top Card */}
                  <Card
                    key={feed[0].id}
                    profile={feed[0]}
                    onSwipe={handleSwipe}
                    isFront={true}
                  />
                </div>

                {/* Bottom Control Buttons */}
                <ActionButtons
                  onPass={() => handleSwipe('PASS')}
                  onLike={() => handleSwipe('LIKE')}
                  onReset={handleReset}
                  disabled={feed.length === 0}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Matches (List of Mutual Matches) */}
        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onBackToFeed={() => setActiveTab('discover')}
            isLoading={isLoadingMatches}
          />
        )}
      </div>

      {/* Bottom Navigation Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchesCount={matches.length}
      />

      {/* Mutual Match Celebration Modal */}
      <MatchModal
        isOpen={showMatchModal}
        profile={matchedProfile}
        onClose={() => setShowMatchModal(false)}
        onViewMatches={() => {
          setShowMatchModal(false);
          setActiveTab('matches');
        }}
      />
    </main>
  );
}
