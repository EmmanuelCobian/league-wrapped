import { NextResponse } from 'next/server';
import { getAccount, getMatchHistory, getMatchDetails } from '@/app/lib/riot-api';
import { generateWrappedData } from '@/app/lib/data-transform';

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
    const matchIds = await getMatchHistory(summoner.puuid, 15);
    
    // 3. Fetch all match details
    const matchPromises = matchIds.map(id => getMatchDetails(id));
    const matches = await Promise.all(matchPromises);
    
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
    console.log('Wrapped API error:', error);
    
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