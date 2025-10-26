export async function enhanceText(text, region) {
  const apiKey = process.env.CLAUDE_API_KEY;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a League of Legends lore expert. Create a 2-4 sentence player description (max 250 tokens) that:
  1. Connects their ${region} region identity with their playstyle
  2. Describes the player AS IF they embody their main champion's essence
  3. Focuses on the PLAYER'S behavior and tendencies, not the champion's lore
  4. Uses vivid, immersive language that feels authentic to ${region}'s culture
  Transform this draft into a compelling narrative. Keep it between 2-4 sentences only:${text}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Full Claude API Response:', JSON.stringify(data.content.text, null, 2)); // ADD THIS LINE

    // Check if response has error
    if (data.error) {
      console.error('Claude API Error:', data.error);
      return text;
    }

    // Check if content exists
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    } else {
      console.error('Unexpected response structure:', data);
      return text;
    }
  } catch (error) {
    console.error('Error enhancing text:', error);
    return text;
  }
}