"use client"
import { useState, useEffect } from 'react';

export default function RoleStats({ onNavigate, data, claudeData }) {
  const [visibleStats, setVisibleStats] = useState(0);

  const stats = data.roleStats

  function champSkill(rating) {
    if (rating <= 3) {
      return "YOU STINK";
    }
    else if (rating <= 5) {
      return "you're avg ma boi";
    }
    else if (rating <= 7) {
      return "you're above avg, ig";
    }
    else {
      return "YOU'RE HIM"
    }
  };



  function reaction() {
    if (stats.laneWins / data.overall.wins > .7) return "Your dominance is unmatched!"
    else if (stats.avgKDA > 3) return "I would not want you on the enemy team."
    else if (stats.topChamp == 'Mel') return "Cringe champ."
    else if (stats.avgKDA < .5) return "Maybe practice this role more?"
    else `A citizen from ${stats.topChamp}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleStats(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        {visibleStats < 3 && (
          <div className={`text-4xl font-bold text-black dark:text-white text-center transition-opacity duration-500 ${visibleStats < 2 ? 'opacity-100' : 'opacity-0'
            }`}>
            When playing on the rift, everyone has their own playstyle.
            What does yours say about you?
          </div>
        )}

        {visibleStats >= 3 && (
          <>
            <div className="flex flex-col items-center gap-10 text-center w-full">
              <h1 className={`text-3xl font-semibold text-black dark:text-white mb-8 transition-all duration-700 ${visibleStats >= 3.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                Region: <span className="font-serif italic">{claudeData.region}</span>
              </h1>

              {/*  */}
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${stats.topChamp}_0.jpg`}
                alt={`${claudeData.region} region`}
                className={`w-full max-w-2xl rounded-lg shadow-lg transition-all duration-700 delay-100 ${visibleStats >= 3.5 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
              />

              <div className={`max-w-3xl mx-auto px-6 py-4 mb-8 transition-all duration-700 ${visibleStats >= 3.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                <h2 className="text-l font-semibold text-black dark:text-white text-center">
                  {claudeData.output}
                </h2>
              </div>

              <h3 className={`text-l font-semibold text-black dark:text-white transition-all duration-700 ${visibleStats >= 3.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                Here are stats that influences this score:
              </h3>
              <div className="w-full max-w-5xl space-y-6">
                {/* Most Played Champion */}
                <div
                  className={`transition-all duration-700 ${visibleStats >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-medium text-black dark:text-white">Most Played Champ</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.topChamp}</span>
                  </div>
                </div>

                {/* Solo Kills */}
                <div
                  className={`transition-all duration-700 ${visibleStats >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-medium text-black dark:text-white">Solo Kills</span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.soloKills}</span>
                  </div>
                </div>

                {/* KDA */}
                <div
                  className={`transition-all duration-700 ${visibleStats >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-medium text-black dark:text-white">KDA</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.avgKDA}</span>
                  </div>
                </div>

                {/* Champ Skill */}
                <div
                  className={`transition-all duration-700 ${visibleStats >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-medium text-black dark:text-white">Champ Skill</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.laneWins}</span>
                  </div>
                  <h1> <span className="text-m font-serif"> {reaction()} </span></h1>
                </div>

              </div>
            </div>

            <div
              className={`flex justify-between w-full transition-all duration-700 ${visibleStats >= 9
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

              {/* Next Button */}
              <button
                onClick={() => onNavigate('next')}
                className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}