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
  const [selectedChamp, setSelectedChamp] = useState(null)

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

        <div className="flex flex-col items-center gap-8 text-center w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-white mb-8">
            Your Overall Stats
          </h1>

          <div className="w-full max-w-5xl space-y-6">
            {/* Two Column Layout for Stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column: Wins and Losses */}
              <div className="space-y-6">
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
              </div>

              {/* Right Column: Kills and Assists */}
              <div className="space-y-6">
                {/* Kills */}
                <div 
                  className={`transition-all duration-700 ${
                    visibleStats >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-medium text-black dark:text-white">Kills</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{overall_stats.kills}</span>
                  </div>
                </div>

                {/* Assists */}
                <div 
                  className={`transition-all duration-700 ${
                    visibleStats >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-medium text-black dark:text-white">Assists</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overall_stats.assists}</span>
                  </div>
                </div>
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
                
                {selectedChamp === null ? (
                  // Default view: All three champions
                  <div className="grid grid-cols-3 gap-2">
                    {overall_stats.topChamps.map((champ, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedChamp(index)}
                        className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-black flex items-end justify-center p-2 hover:scale-105 transition-all duration-500 cursor-pointer"
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
                ) : (
                  // Selected view: Champion on left, stats on right
                  <div className="flex gap-4 items-stretch">
                    {/* Selected Champion */}
                    <div 
                      onClick={() => setSelectedChamp(null)}
                      className="relative w-64 aspect-[9/16] rounded-lg overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-black flex items-end justify-center p-2 hover:scale-105 transition-all duration-500 cursor-pointer flex-shrink-0"
                    >
                      {/* Background Image */}
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.name.replace(" ", "")}_0.jpg`}
                        alt={champ.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      {/* Champion name */}
                      <span className="relative z-10 text-white text-base font-bold text-center leading-tight">
                        {champ.name}
                      </span>
                    </div>
                    
                    {/* Stats Text Box */}
                    <div className="flex-1 flex flex-col justify-center p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-w-0">
                      <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                        {overall_stats.topChamps[selectedChamp][0]} Stats
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base text-zinc-600 dark:text-zinc-400">Games Played</span>
                          <span className="text-lg font-semibold text-black dark:text-white">--</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-zinc-600 dark:text-zinc-400">Total Time Played</span>
                          <span className="text-lg font-semibold text-black dark:text-white">--</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-zinc-600 dark:text-zinc-400">KDA</span>
                          <span className="text-lg font-semibold text-black dark:text-white">--</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-zinc-600 dark:text-zinc-400">Win Rate</span>
                          <span className="text-lg font-semibold text-black dark:text-white">--</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-zinc-600 dark:text-zinc-400">CS</span>
                          <span className="text-lg font-semibold text-black dark:text-white">--</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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