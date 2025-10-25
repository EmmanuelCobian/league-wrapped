/*

DESIGN: PERSONALITY TRAIT, followed by stats

stats about the individual player on champ:
- most played champion: string
- # of solo kills: int
- KDA: double
- winning lane of champ per roles: int
    jungle:
        1 - junglerKillsEarlyJungle 
        2 - epicMonsterKillsNearEnemyJungler
        3 - junglerTakedownsNearDamagedEpicMonster
        4 - kills
    support:
        3 - fasterSupportQuestCompletion
        2 - MAX(timeCCingOthers,totalTimeCCDealt)
        4 - wardTakedowns
        1 - visionScoreAdvantageLaneOpponent
    lane:
        2 - turretKills
        1 - maxCsAdvantageOnLaneOpponent
        3 - totalMinionsKilled
        4 - kills
- personality title: string
    - insert titles:
 */

"use client"
import { useState } from 'react';

export default function RoleStats({ onNavigate, data }) {
  const [visibleStats, setVisibleStats] = useState(0);
  
  const stats = {
    most_played_champ: "Sion",
    solo_kills: 99999,
    kda: 90.0,
    champ_skill: champSkill(9),
    personality_trait: personalityType(0)
  };

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
  
  function personalityType(rating) {
        // TODO: have these reference most_played_champ
        // most_played_champ, solo_kills, kda, champ_skill
        return 0
    };


  useState(() => {
    // Fade in animations
    const interval = setInterval(() => {
        setVisibleStats(prev => prev + 1);
    }, 1000);

    // Auto-navigate after 10 seconds
    const timeout = setTimeout(() => {
      onNavigate('team_player'); // Change to whatever page you want
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="text-4xl font-bold text-black dark:text-white">
          I see how your macro looks like.
        </div>

        <div className="flex flex-col items-center gap-8 text-center w-full">
            <h1 className={`text-3xl font-semibold text-black dark:text-white mb-8 transition-all duration-700 ${
                visibleStats >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
                What about you as a laner?
            </h1>

          <div className="w-full max-w-5xl space-y-6">
            {/* Most Played Champion */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Most Played Champ</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.most_played_champ}</span>
              </div>
            </div>

            {/* Solo Kills */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Solo Kills</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.solo_kills}</span>
              </div>
            </div>

            {/* KDA */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 7  ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">KDA</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.kda}</span>
              </div>
            </div>

            {/* Champ Skill */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Champ Skill</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.champ_skill}</span>
              </div>
            </div>

              {/* Add decider to put them in a region of runeterra (ionia/noxus/zaun) */}
            {/* Personality Trait */}
            <div 
              className={`transition-all duration-700 ${
                visibleStats >= 11 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg font-medium text-black dark:text-white">Personality Trait</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.personality_trait}</span>
              </div>
            </div>
          </div>
        </div>
        <div 
          className={`flex justify-end w-full transition-all duration-700 ${
            visibleStats >= 13 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => onNavigate('time_pref')}
            className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}
