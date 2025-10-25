export function generateWrappedData(matches, playerPuuid) {
  const overview = calculateOverview(matches, playerPuuid);
  const champions = analyzeChampions(matches, playerPuuid);
  const playstyle = calculatePlaystyle(matches, playerPuuid);
  const patterns = detectPatterns(matches, playerPuuid);
  
  return {
    overview,
    champions,
    playstyle,
    patterns,
  };
}

function calculateOverview(matches, playerPuuid) {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let wins = 0;
  
  matches.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    totalKills += player.kills;
    totalDeaths += player.deaths;
    totalAssists += player.assists;
    if (player.win) wins++;
  });
  
  return {
    totalGames: matches.length,
    wins,
    winrate: (wins / matches.length) * 100,
    avgKills: totalKills / matches.length,
    avgDeaths: totalDeaths / matches.length,
    avgAssists: totalAssists / matches.length,
    kda: (totalKills + totalAssists) / totalDeaths
  };
}

function analyzeChampions(matches, playerPuuid) {
  const championStats = {};
  
  matches.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    const champName = player.championName;
    
    if (!championStats[champName]) {
      championStats[champName] = {
        games: 0,
        wins: 0,
        totalKills: 0,
        totalDeaths: 0,
        totalAssists: 0
      };
    }
    
    championStats[champName].games++;
    if (player.win) championStats[champName].wins++;
    championStats[champName].totalKills += player.kills;
    championStats[champName].totalDeaths += player.deaths;
    championStats[champName].totalAssists += player.assists;
  });
  
  // Calculate winrates and KDA
  Object.keys(championStats).forEach(champ => {
    const stats = championStats[champ];
    stats.winrate = (stats.wins / stats.games) * 100;
    stats.avgKDA = ((stats.totalKills + stats.totalAssists) / stats.totalDeaths) / stats.games;
  });
  
  // Get top 5 champions
  const topChampions = Object.entries(championStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);
  
  return {
    mostPlayed: topChampions[0],
    top5: topChampions
  };
}

function calculatePlaystyle(matches, playerPuuid) {
  const aggression = calculateAggression(matches, playerPuuid);
  const teamwork = calculateTeamwork(matches, playerPuuid);
  const consistency = calculateConsistency(matches, playerPuuid);
  
  const scores = { aggression, teamwork, consistency };
  const category = determinePlaystyleCategory(scores);
  
  return {
    scores,
    category: category.name,
    description: category.desc
  };
}

function calculateAggression(matches, playerPuuid) {
  let aggressionScore = 0;
  
  matches.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    
    if (player.kills > 10) aggressionScore += 10;
    if (player.deaths > 7) aggressionScore += 15;
    if (player.challenges?.soloKills > 2) aggressionScore += 20;
  });
  
  return Math.min(100, (aggressionScore / matches.length));
}

function calculateTeamwork(matches, playerPuuid) {
  let teamworkScore = 0;
  
  matches.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    
    const kp = player.challenges?.killParticipation || 0;
    if (kp > 0.65) teamworkScore += 20;
    
    const assistRatio = player.assists / (player.kills || 1);
    if (assistRatio > 1.5) teamworkScore += 20;
    
    const visionPerMin = player.challenges?.visionScorePerMinute || 0;
    if (visionPerMin > 1.5) teamworkScore += 20;
  });
  
  return Math.min(100, (teamworkScore / matches.length));
}

function calculateConsistency(matches, playerPuuid) {
  const kdas = matches.map(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    return player.challenges?.kda || ((player.kills + player.assists) / (player.deaths || 1));
  });
  
  const mean = kdas.reduce((a, b) => a + b, 0) / kdas.length;
  const variance = kdas.reduce((sum, kda) => sum + Math.pow(kda - mean, 2), 0) / kdas.length;
  const stdDev = Math.sqrt(variance);
  
  const consistencyScore = Math.max(0, 100 - (stdDev * 20));
  return consistencyScore;
}

function determinePlaystyleCategory(scores) {
  const { aggression, teamwork, consistency } = scores;
  
  if (aggression > 75 && consistency < 40) {
    return {
      name: "The Limit Tester",
      desc: "You live for the outplay. High risk, high reward is your motto."
    };
  }
  
  if (teamwork > 80 && aggression < 50) {
    return {
      name: "The Unsung Hero",
      desc: "You'd rather set up your team than take the glory. True support energy."
    };
  }
  
  if (Math.abs(consistency - 50) < 15 && aggression > 60) {
    return {
      name: "The Coinflip Player",
      desc: "Will you hard carry or hard int? Even you don't know until the game loads."
    };
  }
  
  return {
    name: "The Balanced Player",
    desc: "You do a bit of everything. Jack of all trades, master of... well, we'll see."
  };
}

function detectPatterns(matches, playerPuuid) {
  const streaks = analyzeStreaks(matches, playerPuuid);
  const timePerformance = analyzeTimePerformance(matches, playerPuuid);
  
  return {
    streaks,
    timePerformance
  };
}

function analyzeStreaks(matches, playerPuuid) {
  const sorted = [...matches].sort((a, b) => 
    a.info.gameStartTimestamp - b.info.gameStartTimestamp
  );
  
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  
  sorted.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    
    if (player.win) {
      currentWinStreak++;
      currentLossStreak = 0;
      if (currentWinStreak > longestWinStreak) {
        longestWinStreak = currentWinStreak;
      }
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      if (currentLossStreak > longestLossStreak) {
        longestLossStreak = currentLossStreak;
      }
    }
  });
  
  return {
    longestWinStreak,
    longestLossStreak
  };
}

function analyzeTimePerformance(matches, playerPuuid) {
  const hourlyStats = {};
  
  matches.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    const hour = new Date(match.info.gameStartTimestamp).getHours();
    
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = { games: 0, wins: 0 };
    }
    
    hourlyStats[hour].games++;
    if (player.win) hourlyStats[hour].wins++;
  });
  
  // Calculate winrates
  Object.keys(hourlyStats).forEach(hour => {
    hourlyStats[hour].winrate = 
      (hourlyStats[hour].wins / hourlyStats[hour].games) * 100;
  });
  
  // Find best time
  const bestHour = Object.entries(hourlyStats)
    .filter(([_, stats]) => stats.games >= 3)
    .sort((a, b) => b[1].winrate - a[1].winrate)[0];
  
  if (!bestHour) {
    return {
      category: "Not Enough Data",
      bestHour: 0,
      bestWinrate: 0,
      timeRange: "N/A"
    };
  }
  
  const bestHourNum = parseInt(bestHour[0]);
  let timeCategory;
  if (bestHourNum >= 22 || bestHourNum <= 4) timeCategory = "Night Owl";
  else if (bestHourNum >= 5 && bestHourNum <= 11) timeCategory = "Early Bird";
  else if (bestHourNum >= 12 && bestHourNum <= 17) timeCategory = "Afternoon Warrior";
  else timeCategory = "Evening Gamer";
  
  return {
    category: timeCategory,
    bestHour: bestHourNum,
    bestWinrate: bestHour[1].winrate,
    timeRange: getTimeRange(bestHourNum)
  };
}

function getTimeRange(hour) {
  if (hour >= 22 || hour <= 2) return "10 PM - 2 AM";
  if (hour >= 3 && hour <= 5) return "3 AM - 5 AM";
  if (hour >= 6 && hour <= 11) return "6 AM - 11 AM";
  if (hour >= 12 && hour <= 17) return "12 PM - 5 PM";
  return "6 PM - 9 PM";
}