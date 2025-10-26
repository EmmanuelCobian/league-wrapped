import { NextResponse } from 'next/server';
import { getAccount, getMatchHistory, getMatchDetails, getProfileIcon } from '@/app/lib/riot-api';
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
  const batchSize = 15;
  const delayBetweenBatches = 1100;
  
  console.log(`Fetching ${matchIds.length} matches in batches of ${batchSize}...`);

  for (let i = 0; i < matchIds.length; i += batchSize) {
    const batch = matchIds.slice(i, i + batchSize);
    
    console.log(`Batch ${Math.floor(i / batchSize) + 1}: Fetching ${batch.length} matches...`);

    try {
      const batchPromises = batch.map(id => getMatchDetails(id));
      const batchResults = await Promise.all(batchPromises);
      matches.push(...batchResults);
      
      console.log(`Batch complete. Total: ${matches.length}/${matchIds.length}`);
    } catch (error) {
      console.error(`Batch failed:`, error.message);
      throw error;
    }

    if (i + batchSize < matchIds.length) {
      await delay(delayBetweenBatches);
    }
  }
  
  console.log(`All matches fetched successfully`);
  return matches;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { gameName, tagLine } = body;

    console.log(`\nNew Wrapped request for ${gameName}#${tagLine}`);

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

    console.log('Step 1: Fetching account...');
    const summoner = await getAccount(gameName, tagLine);

    console.log('Step 2: Fetching match history...');
    const matchIds = await getMatchHistory(summoner.puuid, 30);
    
    console.log('Step 3: Fetching match details...');
    const matches = await fetchMatchesWithRateLimit(matchIds);
    
    console.log('Step 4: Fetching account profile icon...');
    const profileIcon = await getProfileIcon(summoner.puuid, matches[0])

    console.log('Step 5: Generating Wrapped data...');
    const wrappedData = generateWrappedData(matches, summoner.puuid);

    return NextResponse.json({
      success: true,
      data: {
        gameName,
        profileIcon,
        ...wrappedData,
      }
    });

  } catch (error) {
    console.error(`Wrapped API error):`, error.message);
    console.error('Full error:', error);

    if (error.message.includes('RIOT_API_KEY is not configured')) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error. API key not set.' },
        { status: 500 }
      );
    }

    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return NextResponse.json(
        { success: false, error: 'Request timeout. Riot API is taking too long to respond. Please try again.' },
        { status: 504 }
      );
    }

    if (error.message.includes('404')) {
      return NextResponse.json(
        { success: false, error: 'Summoner not found. Check your spelling and tag line!' },
        { status: 404 }
      );
    }

    if (error.message.includes('403')) {
      return NextResponse.json(
        { success: false, error: 'API key error. The server\'s Riot API key may be invalid or expired.' },
        { status: 403 }
      );
    }

    if (error.message.includes('429')) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate Wrapped. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}