import type { PartyForm, PartyTheme } from './types';

const SYSTEM_PROMPT = `You are a brilliant party planner. Return ONLY valid JSON — no markdown, no backticks, no commentary. Use exactly this shape:
{
  "themeName": "Creative 3–5 word theme name",
  "themeEmoji": "one emoji",
  "themeDescription": "2-3 vivid sentences describing the vibe and aesthetic",
  "foodItems": [
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"}
  ],
  "dresscode": {
    "title": "3-4 word dress code name",
    "description": "2 sentences on what to wear",
    "colors": ["Color 1", "Color 2", "Color 3"],
    "avoid": "One sentence on what to avoid"
  }
}`;

export async function generatePartyTheme(form: PartyForm): Promise<PartyTheme> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Plan a party theme for:
Occasion: ${form.occasion}
Vibe: ${form.vibe}
Season: ${form.season}
Cultural Flavor: ${form.culturalFlavor}

Be creative and specific. Food must suit both the culture and theme.`,
      }],
    }),
  });

  const data = await response.json();
  const text = (data.content[0].text as string).replace(/```json|```/g, '').trim();
  return JSON.parse(text) as PartyTheme;
}
