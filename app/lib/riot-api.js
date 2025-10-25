const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL = "https://americas.api.riotgames.com";

/**
 * API endpoint that fetches the public account details for a given game name and and tag line
 * 
 * @param {string} gameName - in game name for a player
 * @param {string} tagLine - tag line for this user (max 5 characters)
 * @returns json response with league puuid, gameName, and tagLine
 */
export async function getAccount(gameName, tagLine) {
  const response = await fetch(
    `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`getAccount Riot API error: ${response.status}`);
  }

  return response.json();
}

/**
 * API endpoint that fetches up to the last 100 games (default 20) for a player with puuid
 * 
 * @param {string} puuid - unique puuid of a player
 * @param {int} count - number of games to fetch
 * @returns json response with match IDs
 */
export async function getMatchHistory(puuid, count = 20) {
  const response = await fetch(
    `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Riot-Token": RIOT_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`getMatchHistory Riot API error: ${response.status}`);
  }

  return response.json();
}

/**
 * API endpoint that fetches match data for a single game
 * 
 * @param {string} matchId - ID of the match
 * @returns json response with the data for that match
 */
export async function getMatchDetails(matchId) {
  const response = await fetch(`${BASE_URL}/lol/match/v5/matches/${matchId}`, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`getMatchDetails Riot API error: ${response.status}`);
  }

  return response.json();
}
