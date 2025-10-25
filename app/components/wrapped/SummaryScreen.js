/**
 * shareable
 * - center = most played champ
 * - top champs
 * - minutes played (time wasted)
 * - best role (highest winrate)
 * - champs played: int
 * - 
 */

/**
 * bestRole
 * bestRoleWinrate
 * champsPlayed
 * minutesPlayed
 * topChamp
 * topChamps
 */

"use client"
import { useState } from 'react';

export default function SummaryScreen({ onNavigate, data }) {
  const [visibleStats, setVisibleStats] = useState(0);
  const stats = data.summary

  useState(() => {
    // Fade in animations
    const interval = setInterval(() => {
        setVisibleStats(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="text-4xl font-bold text-black dark:text-white">
          Here is 
        </div>

        <div className="flex flex-col items-center gap-8 text-center w-full">
            <h1 className={`text-3xl font-semibold text-black dark:text-white mb-8 transition-all duration-700 ${
                visibleStats >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
                How skilled are you?
            </h1>

          <div className="w-full max-w-5xl space-y-6">
            {/* Best Role */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Best Role</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.bestRole}</span>
              </div>
            </div>

            {/* Best Role Winrate */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Best Role Winrate</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.bestRoleWinrate}</span>
              </div>
            </div>

            {/* Champions Played */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 7  ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Number of Champions Played</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.champsPlayed}</span>
              </div>
            </div>

            {/* Minutes Played */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Minutes Played</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.minutesPlayed}</span>
              </div>
            </div>

            {/* Top Champ */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 11 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Top Champ</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.topChamp}</span>
              </div>
            </div>

            {/* Top Champs */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 11 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Top Champ</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.topChamps}</span>
              </div>
            </div>
          </div>
        </div>

        <div
            className={`flex justify-between w-full transition-all duration-700 ${
              visibleStats >= 11
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Previous Button */}
            <button
              onClick={() => onNavigate('prev')}
              className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              ← Previous
            </button>
          </div>
      </main>
    </div>
  );
}
