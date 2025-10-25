import { NextResponse } from 'next/server';
import { getAccount, getMatchHistory, getMatchDetails } from '@/app/lib/riot-api';
import { generateWrappedData } from '@/app/lib/data-transform';

/**
 * Delays execution for specified milliseconds
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches matches in batches with rate limiting
 * Riot API: 20 requests per second, 100 requests per 2 minutes
 */
async function fetchMatchesWithRateLimit(matchIds) {
  const matches = [];
  const batchSize = 15; // Conservative batch size (under 20/sec limit)
  const delayBetweenBatches = 1100; // 1.1 seconds between batches
  
  for (let i = 0; i < matchIds.length; i += batchSize) {
    const batch = matchIds.slice(i, i + batchSize);
    
    // Fetch this batch in parallel
    const batchPromises = batch.map(id => getMatchDetails(id));
    const batchResults = await Promise.all(batchPromises);
    
    matches.push(...batchResults);
    
    // Wait before next batch (unless this is the last batch)
    if (i + batchSize < matchIds.length) {
      await delay(delayBetweenBatches);
    }
  }
  
  return matches;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { gameName, tagLine } = body;
    
    if (!gameName) {
      return NextResponse.json(
        { success: false, error: 'League of Legends in game name required' },
        { status: 400 }
      );
    }
    
    if (!tagLine) {
      return NextResponse.json(
        { success: false, error: 'League of Legends tag line required' },
        { status: 400 }
      );
    }
    
    // 1. Get summoner info
    const summoner = await getAccount(gameName, tagLine);
    
    // 2. Get match history
    const matchIds = await getMatchHistory(summoner.puuid, 20);
    
    // 3. Fetch all match details WITH RATE LIMITING
    const matches = await fetchMatchesWithRateLimit(matchIds);
    
    // 4. Transform data into Wrapped format
    const wrappedData = generateWrappedData(matches, summoner.puuid);
    
    return NextResponse.json({
      success: true,
      data: {
        gameName,
        ...wrappedData,
      }
    });
    
  } catch (error) {
    console.error('Wrapped API error:', error);
    
    if (error.message.includes('404')) {
      return NextResponse.json(
        { success: false, error: 'Summoner not found. Check your spelling and region!' },
        { status: 404 }
      );
    }
    
    if (error.message.includes('429')) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a moment.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate Wrapped. Please try again.' },
      { status: 500 }
    );
  }
}