import { NextResponse } from 'next/server';
import { enhanceText } from '@/app/lib/claude-api';

export async function POST(request) {
  try {
    console.log("Determining player's personality type.")
    const { stats, topChamp } = await request.json();

    // 1. Gets region from Runeterra
    const region = regionLocator(stats.scores);

    // 2. Decides Playstyle
    const playstyle = aggressiveDescription(stats.scores.aggression);

    // 3. Pulls data from ddragon (ADD AWAIT!)
    const championData = await fetchChampionLore(stats.topChamp);

    // 4. Builds prompt
    const output = generateRegionDescription(playstyle, region, championData, topChamp);

    // 5. Enhance with Claude
    const enhanced = await enhanceText(output, region);

    return NextResponse.json({
      success: true,
      output: enhanced,
      region: region 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enhance text' },
      { status: 500 }
    );
  }
}

async function fetchChampionLore(championName) {
  try {
    const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await versionResponse.json();
    const latestVersion = versions[0];
    
    const normalizedName = championName.replace(/[^a-zA-Z]/g, '').replace(/\s+/g, '');
    
    const url = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${normalizedName}.json`;
    const response = await fetch(url);
    const data = await response.json();
    
    const champData = data.data[normalizedName];
    return {
      name: champData.name,
      title: champData.title,
      blurb: champData.blurb,
      tags: champData.tags
    };
  } catch (error) {
    console.error("Error fetching champion data:", error);
    return null;
  }
}

function aggressiveDescription(aggressionScore) {
  if (aggressionScore < 25) return 'passive';
  else if (aggressionScore < 50) return 'smart';
  else return 'aggressive';
}

function regionLocator(data) {
  let region = '';
  if (data.aggression > 50 && data.teamwork > 30 && data.consistency > 40) region = "Noxus";
  else if (data.aggression < 50 && data.teamwork > 40 && data.consistency >= 50) region = "Piltover";
  else if (data.aggression > 50 && data.teamwork < 30 && data.consistency > 40) region = "Zaun";
  else region = "Ionia";
  return region;
}

function generateRegionDescription(playstyle, region, championData, topChamp) {
  const regionFlavors = {
    "Demacia": {
      prefix: "In the name of Demacia's justice",
      style: "honorable and steadfast",
      suffix: "upholding the kingdom's noble ideals with unwavering resolve"
    },
    "Noxus": {
      prefix: "With Noxian strength and ambition",
      style: "ruthless and dominating",
      suffix: "crushing all opposition to prove their supremacy"
    },
    "Ionia": {
      prefix: "Following Ionia's harmonious balance",
      style: "graceful and spiritually attuned",
      suffix: "flowing through combat like wind through cherry blossoms"
    },
    "Freljord": {
      prefix: "Bearing the Freljord's savage resilience",
      style: "unyielding and fierce",
      suffix: "weathering every storm like the frozen tundra itself"
    },
    "Piltover": {
      prefix: "With Piltovan precision and innovation",
      style: "calculated and refined",
      suffix: "applying hextech efficiency to every calculated move"
    },
    "Zaun": {
      prefix: "Embracing Zaun's chaotic ingenuity",
      style: "unpredictable and experimental",
      suffix: "thriving in the chemical haze where others would falter"
    },
    "Shurima": {
      prefix: "Carrying Shurima's ancient glory",
      style: "commanding and ascendant",
      suffix: "rising like the sun emperor over golden sands"
    },
    "Shadow Isles": {
      prefix: "Shrouded in the Shadow Isles' darkness",
      style: "relentless and haunting",
      suffix: "bringing inevitable doom like the Black Mist itself"
    },
    "Bilgewater": {
      prefix: "With Bilgewater's cutthroat cunning",
      style: "opportunistic and daring",
      suffix: "seizing victory like a pirate claims plunder"
    },
    "Targon": {
      prefix: "Blessed by Mount Targon's cosmic power",
      style: "transcendent and destined",
      suffix: "reaching beyond mortal limits toward celestial glory"
    },
    "Void": {
      prefix: "Consumed by the Void's insatiable hunger",
      style: "alien and overwhelming",
      suffix: "devouring all that stands before them without mercy"
    },
    "Bandle City": {
      prefix: "With Bandle City's whimsical spirit",
      style: "playful yet surprisingly deadly",
      suffix: "proving that size means nothing when magic is involved"
    },
    "Ixtal": {
      prefix: "From Ixtal's hidden elemental depths",
      style: "mystical and territorial",
      suffix: "wielding nature's raw power with ancient authority"
    }
  };
  
  const flavor = regionFlavors[region] || {
    prefix: "From the lands of " + region,
    style: "determined and skilled",
    suffix: "fighting with unwavering determination"
  };
  
  const championBlurb = championData?.blurb 
    ? championData.blurb.replace(/<[^>]*>/g, '').substring(0, 120) + "..."
    : "who commands the Rift with practiced skill";
  
  const playstyleDescriptor = playstyle.toLowerCase();
  const championName = topChamp || "their chosen champion";
  
  return `${flavor.prefix}, this ${flavor.style} warrior embodies the ${playstyleDescriptor} approach. Channeling ${championName}, ${championBlurb}, they fight ${flavor.suffix}.`;
}