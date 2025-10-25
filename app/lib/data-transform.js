export function generateWrappedData(matches, playerPuuid) {
  const overall = calculateOverallStats(matches, playerPuuid);
  const mechanical = calculateMechanicalSkill(matches, playerPuuid);
  //   const teamPlayer = calculateTeamPlayerSkill(matches, playerPuuid);
  const timePref = calculateTimePreference(matches, playerPuuid);
  const topChamps = overall.topChamps || [];
  const roleStats = calculateRoleStats(
    matches,
    playerPuuid,
    topChamps[0][0] || ""
  );
  const summary = calculateSummary(matches, playerPuuid, topChamps);

  return {
    overall,
    mechanical,
    // teamPlayer,
    timePref,
    roleStats,
    summary,
  };
}

function calculateTimePreference(matches, playerPuuid) {
  const timeBlocks = {
    'Early Morning': { start: 5, end: 9 },    // 5 AM - 9 AM
    'Morning': { start: 9, end: 12 },         // 9 AM - 12 PM
    'Afternoon': { start: 12, end: 17 },      // 12 PM - 5 PM
    'Evening': { start: 17, end: 22 },        // 5 PM - 10 PM
    'Late Night': { start: 22, end: 24 },     // 10 PM - 12 AM
    'Night Owl': { start: 0, end: 5 }         // 12 AM - 5 AM
  };
  
  const blockStats = {};
  Object.keys(timeBlocks).forEach(block => {
    blockStats[block] = { games: 0, wins: 0 };
  });
  
  matches.forEach(match => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    if (!player) return;
    
    const date = new Date(match.info.gameStartTimestamp);
    const hour = date.getHours();
    
    for (const [blockName, block] of Object.entries(timeBlocks)) {
      if (block.start < block.end) {
        // Normal range (e.g., 9-12)
        if (hour >= block.start && hour < block.end) {
          blockStats[blockName].games++;
          if (player.win) blockStats[blockName].wins++;
          break;
        }
      } else {
        // Wraps around midnight (e.g., Night Owl: 0-5)
        if (hour >= block.start || hour < block.end) {
          blockStats[blockName].games++;
          if (player.win) blockStats[blockName].wins++;
          break;
        }
      }
    }
  });
  
  // Calculate winrates for each block
  const blockData = Object.entries(blockStats).map(([name, stats]) => ({
    name,
    games: stats.games,
    wins: stats.wins,
    winrate: stats.games > 0 ? roundToDecimal((stats.wins / stats.games) * 100, 1) : 0
  })).filter(block => block.games > 0); // Only blocks with games
  
  // Determine if player plays throughout the day
  const blocksPlayed = blockData.filter(block => block.games >= 3).length; // Min 3 games per block
  const playsAllDay = blocksPlayed >= 4; // Plays in 4+ different time blocks
  
  // Find best time block (highest winrate with min 5 games)
  let bestBlock = blockData
    .filter(block => block.games >= 5)
    .sort((a, b) => {
      // Primary sort: winrate
      if (b.winrate !== a.winrate) return b.winrate - a.winrate;
      // Secondary sort: games played (if winrates tied)
      return b.games - a.games;
    })[0];
  
  // If no block has 5+ games, find block with most games
  if (!bestBlock) {
    bestBlock = blockData.sort((a, b) => b.games - a.games)[0];
  }
  
  // If player only plays in one time block
  if (blocksPlayed === 1) {
    const onlyBlock = blockData[0];
    return {
      playsAllDay: false,
      timeSlot: onlyBlock.name,
      winrate: onlyBlock.winrate,
      blockBreakdown: blockData
    };
  }
  
  // Case 1: Player has a dominant time block (70%+ of games in 1-2 blocks)
  if (!playsAllDay) {
    const dominantBlock = blockData.sort((a, b) => b.games - a.games)[0];
    const gamesInDominant = dominantBlock.games;
    const totalGames = matches.length;
    const dominancePercent = (gamesInDominant / totalGames) * 100;
    
    return {
      playsAllDay: false,
      timeSlot: dominantBlock.name,
      winrate: dominantBlock.winrate,
      blockBreakdown: blockData
    };
  }
  
  // Case 2: Player plays throughout the day
  return {
    playsAllDay: true,
    timeSlot: bestBlock.name,
    winrate: bestBlock.winrate,
    blockBreakdown: blockData.sort((a, b) => b.winrate - a.winrate)
  };
}

function calculateOverallStats(matches, playerPuuid) {
  let wins = 0;
  let losses = 0;
  let assists = 0;
  let kills = 0;
  let champsPlayed = {};

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);
    if (!player) return;

    if (player.win) wins += 1;
    else losses += 1;

    assists += player.assists;
    kills += player.kills;

    if (!champsPlayed[player.championName]) {
      champsPlayed[player.championName] = 0;
    }
    champsPlayed[player.championName] += 1;
  });

  const topChamps = Object.entries(champsPlayed)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(3, matches.length));

  return {
    wins,
    losses,
    assists,
    kills,
    topChamps,
  };
}

function calculateMechanicalSkill(matches, playerPuuid) {
  let objectivesHelpedWith = 0;
  let towersTaken = 0;
  let totalCS = 0;
  let skillShotsHit = 0;
  let skillShotsDodged = 0;

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);
    const ch = player.challenges || {};

    totalCS += player.totalMinionsKilled + player.neutralMinionsKilled;
    towersTaken += player.turretTakedowns || 0;
    skillShotsHit += ch.skillshotsHit || 0;
    skillShotsDodged += ch.skillshotsDodged || 0;

    objectivesHelpedWith += player.turretTakedowns || 0;
    objectivesHelpedWith += ch.turretPlatesTaken || 0;
    objectivesHelpedWith += ch.soloTurretsLateGame || 0;
    objectivesHelpedWith += ch.turretsTakenWithRiftHerald || 0;
    objectivesHelpedWith += ch.dragonTakedowns || 0;
    objectivesHelpedWith += ch.baronTakedowns || 0;
    objectivesHelpedWith += ch.riftHeraldTakedowns || 0;
    objectivesHelpedWith += player.inhibitorTakedowns || 0;
  });

  return {
    avgObjectivesHelpedWith: roundToDecimal(
      objectivesHelpedWith / matches.length,
      2
    ),
    avgTowersTaken: roundToDecimal(towersTaken / matches.length, 2),
    avgCS: roundToDecimal(totalCS / matches.length, 2),
    avgSkillshotsHit: roundToDecimal(skillShotsHit / matches.length, 2),
    avgSkillshotsDodged: roundToDecimal(skillShotsDodged / matches.length, 2),
  };
}

function calculateRoleStats(matches, playerPuuid, topChamp) {
  let soloKills = 0;
  let kda = 0;
  let laneWins = 0;
  let laningGames = 0;

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);
    const ch = player.challenges || {};
    if (!player) return;

    soloKills += ch.soloKills || 0;
    kda += ch.kda || 0;

    if (isTraditionalLaningMode(match)) {
      laningGames++;
      if (wonLane(player, match)) {
        laneWins += 1;
      }
    }
  });

  const aggression = roundToDecimal(
    calculateAggression(matches, playerPuuid),
    2
  );
  const teamwork = roundToDecimal(calculateTeamwork(matches, playerPuuid), 2);
  const consistency = roundToDecimal(
    calculateConsistency(matches, playerPuuid),
    2
  );

  const scores = { aggression, teamwork, consistency };

  return {
    topChamp,
    soloKills,
    avgKDA: roundToDecimal(kda / matches.length, 2),
    laneWins,
    laningGames,
    scores,
  };
}

function isTraditionalLaningMode(match) {
  const gameMode = match.info.gameMode;
  const queueId = match.info.queueId;

  if (gameMode === "CLASSIC") {
    return true;
  }

  const traditionalQueues = [
    400, // Normal Draft
    420, // Ranked Solo/Duo
    430, // Normal Blind Pick
    440, // Ranked Flex
    490, // Quickplay
  ];

  return traditionalQueues.includes(queueId);
}

function wonLane(player) {
  const ch = player.challenges || {};
  const role = player.teamPosition;

  if (role === "JUNGLE") {
    return wonJungle(player, ch);
  } else if (role === "UTILITY") {
    return wonSupport(player, ch);
  } else {
    return wonLane_Standard(player, ch);
  }
}

function wonJungle(player, ch) {
  let score = 0;
  let maxScore = 4;

  // 1. Early jungle dominance (weight: 1)
  const earlyJungle = ch.junglerKillsEarlyJungle || 0;
  if (earlyJungle >= 2) score += 1;
  else if (earlyJungle === 1) score += 0.5;

  // 2. Objective control near enemy jungler (weight: 2)
  const objectiveControl = ch.epicMonsterKillsNearEnemyJungler || 0;
  if (objectiveControl >= 1) score += 2;
  else if (objectiveControl > 0) score += 1;

  // 3. Objective participation (weight: 3)
  const objectiveParticipation = ch.junglerTakedownsNearDamagedEpicMonster || 0;
  if (objectiveParticipation >= 2) score += 3;
  else if (objectiveParticipation === 1) score += 1.5;

  // 4. Early kills/impact (weight: 4)
  const kills = player.kills || 0;
  const assists = player.assists || 0;
  const takedownsFirst25 = ch.takedownsFirst25Minutes || 0;

  if (takedownsFirst25 >= 5) score += 4;
  else if (takedownsFirst25 >= 3) score += 2;
  else if (kills + assists >= 3) score += 1;

  // Jungle "won lane" if score is 50% or higher
  return score / maxScore >= 0.5;
}

function wonSupport(player, ch) {
  let score = 0;
  let maxScore = 4;

  // 1. Vision advantage (weight: 1) - MOST IMPORTANT FOR SUPPORT
  const visionAdvantage = ch.visionScoreAdvantageLaneOpponent || 0;
  if (visionAdvantage > 0.2) score += 1; // 20%+ vision advantage
  else if (visionAdvantage > 0) score += 0.5;

  // 2. CC contribution (weight: 2)
  const ccScore = Math.max(
    player.timeCCingOthers || 0,
    player.totalTimeCCDealt || 0
  );
  // Normalize: high CC is 60+ seconds
  if (ccScore >= 60) score += 2;
  else if (ccScore >= 40) score += 1;
  else if (ccScore >= 20) score += 0.5;

  // 3. Support quest completion (weight: 3)
  const questSpeed = ch.fasterSupportQuestCompletion || 0;
  if (questSpeed > 0) score += 3; // Completed quest faster than opponent
  else score += 1.5; // Neutral/no data

  // 4. Ward control (weight: 4)
  const wardTakedowns = player.wardTakedowns || 0;
  const wardsPlaced = player.wardsPlaced || 0;
  const wardScore = wardTakedowns + wardsPlaced * 0.1; // Value clearing more

  if (wardScore >= 20) score += 4;
  else if (wardScore >= 15) score += 2;
  else if (wardScore >= 10) score += 1;

  // Support "won lane" if score is 50% or higher
  return score / maxScore >= 0.5;
}

function wonLane_Standard(player, ch) {
  let score = 0;
  let maxScore = 4;

  // 1. CS advantage (weight: 1) - PRIMARY INDICATOR
  const csAdvantage = ch.maxCsAdvantageOnLaneOpponent || 0;
  if (csAdvantage >= 30) score += 1; // Big lead
  else if (csAdvantage >= 20) score += 0.75;
  else if (csAdvantage >= 10) score += 0.5;
  else if (csAdvantage >= 0) score += 0.25; // Even or slightly ahead
  // Negative CS advantage = 0 points

  // 2. Turret pressure (weight: 2)
  const turretKills = player.turretKills || 0;
  const turretPlates = ch.turretPlatesTaken || 0;
  const turretScore = turretKills * 2 + turretPlates;

  if (turretScore >= 4) score += 2; // Took tower or lots of plates
  else if (turretScore >= 2) score += 1;
  else if (turretScore >= 1) score += 0.5;

  // 3. Total CS (weight: 3) - Overall farm quality
  const totalCS = player.totalMinionsKilled || 0;
  const gameDuration = (player.timePlayed || 1800) / 60; // Convert to minutes
  const csPerMin = totalCS / gameDuration;

  // CS/min benchmarks vary by role but ~7+ is good
  if (csPerMin >= 8) score += 3; // Excellent
  else if (csPerMin >= 7) score += 2; // Good
  else if (csPerMin >= 6) score += 1; // Average
  else if (csPerMin >= 5) score += 0.5; // Below average

  // 4. Kills/pressure (weight: 4)
  const kills = player.kills || 0;
  const deaths = player.deaths || 0;
  const soloKills = ch.soloKills || 0;
  const laningPhaseAdvantage = ch.earlyLaningPhaseGoldExpAdvantage || 0;

  // Prioritize solo kills and gold advantages
  if (soloKills >= 2) score += 4; // Dominated lane
  else if (soloKills >= 1) score += 3;
  else if (laningPhaseAdvantage > 500) score += 2.5; // Big gold lead
  else if (kills > deaths) score += 2;
  else if (kills === deaths && deaths <= 1) score += 1;

  // Lane won if score is 50% or higher
  return score / maxScore >= 0.5;
}

function calculateSummary(matches, playerPuuid, topChamps) {
  let minutesPlayed = 0;
  let rolesPlayed = {};
  let champsPlayedSet = new Set();

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);
    if (!player) return;

    const gameMinutes = (player.timePlayed || match.info.gameDuration) / 60;
    minutesPlayed += gameMinutes;

    champsPlayedSet.add(player.championName);

    const role = player.teamPosition || player.individualPosition || "UNKNOWN";
    if (role != "Invalid") {
      if (!rolesPlayed[role]) {
        rolesPlayed[role] = { games: 0, wins: 0 };
      }
      rolesPlayed[role].games++;
      if (player.win) rolesPlayed[role].wins++;
    }
  });

  let bestRole = "N/A";
  let bestWinrate = 0;
  Object.entries(rolesPlayed).forEach(([role, stats]) => {
    const winrate = (stats.wins / stats.games) * 100;
    if (stats.games >= 3 && winrate > bestWinrate) {
      bestWinrate = winrate;
      bestRole = role;
    }
  });

  const roleNames = {
    TOP: "Top",
    JUNGLE: "Jungle",
    MIDDLE: "Mid",
    BOTTOM: "ADC",
    UTILITY: "Support",
  };
  const bestRoleDisplay = roleNames[bestRole] || bestRole;

  return {
    topChamp: topChamps[0]?.[0] || "N/A",
    topChamps,
    minutesPlayed: Math.floor(minutesPlayed),
    bestRole: bestRoleDisplay,
    bestRoleWinrate: roundToDecimal(bestWinrate, 1),
    champsPlayed: champsPlayedSet.size,
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
    description: category.desc,
  };
}

function calculateAggression(matches, playerPuuid) {
  let aggressionScore = 0;

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);

    if (player.kills > 10) aggressionScore += 10;
    if (player.deaths > 7) aggressionScore += 15;
    if (player.challenges?.soloKills > 2) aggressionScore += 20;
  });

  return Math.min(100, aggressionScore / matches.length);
}

function calculateTeamwork(matches, playerPuuid) {
  let teamworkScore = 0;

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);

    const kp = player.challenges?.killParticipation || 0;
    if (kp > 0.65) teamworkScore += 20;

    const assistRatio = player.assists / (player.kills || 1);
    if (assistRatio > 1.5) teamworkScore += 20;

    const visionPerMin = player.challenges?.visionScorePerMinute || 0;
    if (visionPerMin > 1.5) teamworkScore += 20;
  });

  return Math.min(100, teamworkScore / matches.length);
}

function calculateConsistency(matches, playerPuuid) {
  const kdas = matches.map((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);
    return (
      player.challenges?.kda ||
      (player.kills + player.assists) / (player.deaths || 1)
    );
  });

  const mean = kdas.reduce((a, b) => a + b, 0) / kdas.length;
  const variance =
    kdas.reduce((sum, kda) => sum + Math.pow(kda - mean, 2), 0) / kdas.length;
  const stdDev = Math.sqrt(variance);

  const consistencyScore = Math.max(0, 100 - stdDev * 20);
  return consistencyScore;
}

function determinePlaystyleCategory(scores) {
  const { aggression, teamwork, consistency } = scores;

  if (aggression > 75 && consistency < 40) {
    return {
      name: "The Limit Tester",
      desc: "You live for the outplay. High risk, high reward is your motto.",
    };
  }

  if (teamwork > 80 && aggression < 50) {
    return {
      name: "The Unsung Hero",
      desc: "You'd rather set up your team than take the glory. True support energy.",
    };
  }

  if (Math.abs(consistency - 50) < 15 && aggression > 60) {
    return {
      name: "The Coinflip Player",
      desc: "Will you hard carry or hard int? Even you don't know until the game loads.",
    };
  }

  return {
    name: "The Balanced Player",
    desc: "You do a bit of everything. Jack of all trades, master of... well, we'll see.",
  };
}

function detectPatterns(matches, playerPuuid) {
  const streaks = analyzeStreaks(matches, playerPuuid);
  const timePerformance = analyzeTimePerformance(matches, playerPuuid);

  return {
    streaks,
    timePerformance,
  };
}

function analyzeStreaks(matches, playerPuuid) {
  const sorted = [...matches].sort(
    (a, b) => a.info.gameStartTimestamp - b.info.gameStartTimestamp
  );

  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;

  sorted.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);

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
    longestLossStreak,
  };
}

function analyzeTimePerformance(matches, playerPuuid) {
  const hourlyStats = {};

  matches.forEach((match) => {
    const player = match.info.participants.find((p) => p.puuid === playerPuuid);
    const hour = new Date(match.info.gameStartTimestamp).getHours();

    if (!hourlyStats[hour]) {
      hourlyStats[hour] = { games: 0, wins: 0 };
    }

    hourlyStats[hour].games++;
    if (player.win) hourlyStats[hour].wins++;
  });

  // Calculate winrates
  Object.keys(hourlyStats).forEach((hour) => {
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
      timeRange: "N/A",
    };
  }

  const bestHourNum = parseInt(bestHour[0]);
  let timeCategory;
  if (bestHourNum >= 22 || bestHourNum <= 4) timeCategory = "Night Owl";
  else if (bestHourNum >= 5 && bestHourNum <= 11) timeCategory = "Early Bird";
  else if (bestHourNum >= 12 && bestHourNum <= 17)
    timeCategory = "Afternoon Warrior";
  else timeCategory = "Evening Gamer";

  return {
    category: timeCategory,
    bestHour: bestHourNum,
    bestWinrate: bestHour[1].winrate,
    timeRange: getTimeRange(bestHourNum),
  };
}

function getTimeRange(hour) {
  if (hour >= 22 || hour <= 2) return "10 PM - 2 AM";
  if (hour >= 3 && hour <= 5) return "3 AM - 5 AM";
  if (hour >= 6 && hour <= 11) return "6 AM - 11 AM";
  if (hour >= 12 && hour <= 17) return "12 PM - 5 PM";
  return "6 PM - 9 PM";
}

function roundToDecimal(num, places) {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}
