const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL = "https://americas.api.riotgames.com";

export async function getAccount(gameName, tagLine) {
  const response = await fetch(
    `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    {
      headers: {
        "X-Riot-Token": "RGAPI-4c7869b2-58b4-4dfe-a815-5417f32cdc89",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`getAccount Riot API error: ${response.status}`);
  }

  return response.json();
}

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
