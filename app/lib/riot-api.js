const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL = "https://americas.api.riotgames.com";

/**
 * Helper function to fetch with timeout and better error handling
 */
async function fetchWithTimeout(url, options, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timeout: Riot API took too long to respond");
    }

    // Enhance error message with more details
    throw new Error(`Network error: ${error.message}`);
  }
}

/**
 * API endpoint that fetches the public account details for a given game name and tag line
 *
 * @param {string} gameName - in game name for a player
 * @param {string} tagLine - tag line for this user (max 5 characters)
 * @returns json response with league puuid, gameName, and tagLine
 */
export async function getAccount(gameName, tagLine) {
  if (!RIOT_API_KEY) {
    throw new Error("RIOT_API_KEY is not configured in environment variables");
  }

  const url = `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;

  console.log(`Fetching account: ${gameName}#${tagLine}`);
  console.log(`URL: ${url}`);

  const response = await fetchWithTimeout(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "No error body");
    console.error(`getAccount failed: ${response.status} - ${errorText}`);

    if (response.status === 404) {
      throw new Error("404: Summoner not found. Check spelling and tag line.");
    }
    if (response.status === 403) {
      throw new Error(
        "403: Invalid or expired API key. Get a new key from developer.riotgames.com"
      );
    }
    if (response.status === 429) {
      throw new Error("429: Rate limit exceeded");
    }

    throw new Error(`getAccount Riot API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Account found: ${data.puuid}`);
  return data;
}

/**
 * API endpoint that fetches up to the last 100 games (default 20) for a player with puuid
 *
 * @param {string} puuid - unique puuid of a player
 * @param {int} count - number of games to fetch
 * @returns json response with match IDs
 */
export async function getMatchHistory(puuid, count = 20) {
  if (!RIOT_API_KEY) {
    throw new Error("RIOT_API_KEY is not configured");
  }

  const url = `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;

  console.log(`📜 Fetching ${count} matches for ${puuid.substring(0, 8)}...`);

  const response = await fetchWithTimeout(url, {
    headers: {
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Riot-Token": RIOT_API_KEY,
    },
  });

  if (!response.ok) {
    console.error(`getMatchHistory failed: ${response.status}`);
    throw new Error(`getMatchHistory Riot API error: ${response.status}`);
  }

  const matchIds = await response.json();
  console.log(`Found ${matchIds.length} matches`);
  return matchIds;
}

/**
 * Finds and returns the last used player icon from the list of the player's last games
 * 
 * @param {string} puuid - unique uuid of a player
 * @param {Object} match - latest match data
 * @returns int for the profile icon number from the player's most recent game
 */
export async function getProfileIcon(puuid, match) {
  const player = match.info.participants.find((p) => p.puuid === puuid);
  if (!player) return 0;

  return player.profileIcon
}

/**
 * API endpoint that fetches match data for a single game
 *
 * @param {string} matchId - ID of the match
 * @returns json response with the data for that match
 */
export async function getMatchDetails(matchId) {
  if (!RIOT_API_KEY) {
    throw new Error("RIOT_API_KEY is not configured");
  }

  const url = `${BASE_URL}/lol/match/v5/matches/${matchId}`;

  const response = await fetchWithTimeout(
    url,
    {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
    },
    20000
  ); // 20 second timeout for match details (can be large)

  if (!response.ok) {
    console.error(
      `getMatchDetails failed for ${matchId}: ${response.status}`
    );
    throw new Error(`getMatchDetails Riot API error: ${response.status}`);
  }

  return response.json();
}
