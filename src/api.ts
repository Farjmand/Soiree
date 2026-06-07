import type { PartyForm, PartyTheme } from './types';

const SYSTEM_PROMPT = `You are a brilliant party planner. Return ONLY valid JSON — no markdown, no backticks, no commentary. Use exactly this shape:
{
  "themeName": "Creative 1–3 word theme name",
  "themeEmoji": "one emoji",
  "themeDescription": ["Bullet point 1: vivid, slightly funny line about the vibe", "Bullet point 2: vivid, slightly funny line about the aesthetic", "Bullet point 3: vivid, slightly funny line about the mood"],
  "foodItems": [
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"},
    {"name": "Dish Name", "description": "One-line description"}
  ],
  "dresscode": {
    "title": "2 words dress code name",
    "description": "2 sentences on what to wear. Use bulletpoints and simple, readable sentences. Avoid using the same words again and again",
    "colors": ["Color 1", "Color 2", "Color 3"],
    "avoid": "One sentence on what to avoid"
  }
}`;

function assertPartyThemeShape(value: unknown): asserts value is PartyTheme {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('Unexpected party theme shape: response must be an object');
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.themeName !== 'string') {
    throw new TypeError('Unexpected party theme shape: themeName must be a string');
  }

  if (
    !Array.isArray(candidate.themeDescription) ||
    !candidate.themeDescription.every((entry) => typeof entry === 'string')
  ) {
    throw new TypeError('Unexpected party theme shape: themeDescription must be an array of strings');
  }
}

export function parsePartyThemeResponse(rawText: string): PartyTheme {
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Could not parse party theme from Gemini response');
  }

  assertPartyThemeShape(parsed);
  return parsed;
}

export async function generatePartyTheme(form: PartyForm): Promise<PartyTheme> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        role: 'user',
        parts: [{
          text: `Plan a party theme for:
Occasion: ${form.occasion}
Vibe: ${form.vibe}
Season: ${form.season}
Cultural Flavor: ${form.culturalFlavor}
Fictional Inspiration: ${form.fictionalUniverse || 'None'}

Be creative and specific. Food must suit both the culture and theme.`,
        }],
      }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status})`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string') {
    throw new TypeError('Unexpected response from Gemini');
  }

  return parsePartyThemeResponse(text);
}
