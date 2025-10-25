/* 
stats to use:
- win: int
- loss: int
- assists: int
- kills: int
- champs played: List[string]
*/
"use client"
import { useState } from 'react';

export default function OverallStats({ onNavigate, data}) {
  const overall_stats = data.overall
  
  const [visibleStats, setVisibleStats] = useState(0)

    useState(() => {
    // Fade in animations
    const interval = setInterval(() => {
        setVisibleStats(prev => prev + 1);
    }, 1000);

    // Auto-navigate after 10 seconds
    // const timeout = setTimeout(() => {
    //   onNavigate('mechanic');
    // }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="text-4xl font-bold text-black dark:text-white">
          RIOT WRAPPED
        </div>

        <div className="flex flex-col items-center gap-8 text-center w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-white mb-8">
            Your Overall Stats
          </h1>

          <div className="w-full max-w-5xl space-y-6">
            {/* Wins */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Wins</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{overall_stats.wins}</span>
              </div>
            </div>

            {/* Losses */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Losses</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{overall_stats.losses}</span>
              </div>
            </div>

            {/* Assists */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Assists</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overall_stats.assists}</span>
              </div>
            </div>

            {/* Kills */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Kills</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{overall_stats.kills}</span>
              </div>
            </div>

            {/* Champions Played */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex flex-col gap-3">
                <span className="text-lg font-medium text-black dark:text-white text-center mb-2">Champions Played</span>
                <div className="grid grid-cols-3 gap-2">
                  {overall_stats.topChamps.map((champ, index) => (
                    <div 
                      key={index}
                      className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-black flex items-end justify-center p-2 hover:scale-105 transition-transform"
                    >
                      {/* Background Image */}
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ[0].replace(" ", "")}_0.jpg`}
                        alt={champ[0]}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      {/* Champion name */}
                      <span className="relative z-10 text-white text-base font-bold text-center leading-tight">
                        {champ[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
            className={`flex justify-end w-full transition-all duration-700 ${
            visibleStats >= 11
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          >
            {/* Next Button */}
            <button
              onClick={() => onNavigate('next', 'mechanical')}
              className="flex-center h-12 items-right justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Next →
            </button>
          </div>

      </main>
    </div>
  );
}
