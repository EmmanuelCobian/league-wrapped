import { roundToDecimal, normalizeToPercentile } from "./utils";

/**
 * Compiles all of the data into an object for the front end. Each key in the object represents a different screen in the front end
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid of a player in this match
 * @returns object with wrapped data
 */
export function generateWrappedData(matches, playerPuuid) {
  const overall = calculateOverallStats(matches, playerPuuid);
  const mechanical = calculateMechanicalSkill(matches, playerPuuid);
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
    timePref,
    roleStats,
    summary,
  };
}

/**
 * Finds the time of day where a player plays most/the best. Returns an object with info on their most played slot, and or, best slot with best winrate
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid of a player in this match
 * @returns object with player time preference
 */
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
  
  const blockData = Object.entries(blockStats).map(([name, stats]) => ({
    name,
    games: stats.games,
    wins: stats.wins,
    winrate: stats.games > 0 ? roundToDecimal((stats.wins / stats.games) * 100, 1) : 0
  })).filter(block => block.games > 0);
  
  const blocksPlayed = blockData.filter(block => block.games >= 3).length;
  const playsAllDay = blocksPlayed >= 4;
  
  let bestBlock = blockData
    .filter(block => block.games >= 5)
    .sort((a, b) => {
      if (b.winrate !== a.winrate) return b.winrate - a.winrate;
      return b.games - a.games;
    })[0];
  
  if (!bestBlock) {
    bestBlock = blockData.sort((a, b) => b.games - a.games)[0];
  }
  
  if (blocksPlayed === 1) {
    const onlyBlock = blockData[0];
    return {
      playsAllDay: false,
      timeSlot: onlyBlock.name,
      winrate: onlyBlock.winrate,
      blockBreakdown: blockData
    };
  }
  
  if (!playsAllDay) {
    const dominantBlock = blockData.sort((a, b) => b.games - a.games)[0];
    
    return {
      playsAllDay: false,
      timeSlot: dominantBlock.name,
      winrate: dominantBlock.winrate,
      blockBreakdown: blockData
    };
  }
  
  return {
    playsAllDay: true,
    timeSlot: bestBlock.name,
    winrate: bestBlock.winrate,
    blockBreakdown: blockData.sort((a, b) => b.winrate - a.winrate)
  };
}

/**
 * Generates 1st screen overall stats for a player
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid of a player in this match
 * @returns object with a player's overall stats
 */
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

/**
 * Generates a player's mechanical stats
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid of a player in this match
 * @returns object with a player's stats that represent their mechanical skill
 */
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

/**
 * Generates a player's role stats for their most played champ and role
 * 
 * @param {Array[Object]} matches - the list of matches
 * @param {string} playerPuuid - the unique puuid of a player in this match
 * @param {string} topChamp - the name of the player's most played champ
 * @returns object with a player's stats that highlights their champ and role
 */
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

/**
 * Checks whether a match is a match on summoner's rift. No ARAM, custom games, arcade games, etc.
 * 
 * @param {Object} match - the match data
 * @returns boolean whether a match is a summoner's rift map match
 */
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

/**
 * Determine whether a player won their lane
 * 
 * @param {Object} player - player data for a match
 * @returns true if player won their lane, false otherwise
 */
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

/**
 * Determines whether a jungle laning player won their lane
 * 
 * @param {Object} player - the player data for a match
 * @param {Object} ch - player's challenge stats for a match
 * @returns true if player won lane as jungle, false otherwise
 */
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

/**
 * Determines whether a support laning player won their lane
 * 
 * @param {Object} player - the player data for a match
 * @param {Object} ch - player's challenge stats for a match
 * @returns true if a plyer won lane as support, false otherwise
 */
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

/**
 * Determines whether a top, mid, or adc laning player won their lane
 * 
 * @param {Object} player - the player data for a match
 * @param {Object} ch - player's challenge stats for a match
 * @returns true if a player won lane as top, mid, or adc, false otherwise
 */
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

/**
 * Generates summary stats for a player
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid for a player
 * @param {Array[Array[string, int]]} topChamps - list of most played champs and number of games played on that champ
 * @returns object with summary stats for the summary screen
 */
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

/**
 * Calculates a player's aggression score
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid for a player
 * @returns float score representing aggression
 */
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

/**
 * Calculates a player's teamwork score
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid for a player
 * @returns float score representing teamwork
 */
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

/**
 * Calculates a player's consistency score
 * 
 * @param {Array[Object]} matches - list of matches
 * @param {string} playerPuuid - the unique puuid for a player
 * @returns float score representing consistency
 */
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
