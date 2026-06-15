import type { Recipe } from './types';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';

const SYSTEM_PROMPT = `You are a brilliant chef. Return ONLY valid JSON — no markdown, no backticks, no commentary. Use exactly this shape:
{
  "ingredients": ["Ingredient with quantity", "Ingredient with quantity"],
  "instructions": ["Step 1", "Step 2"]
}`;

export interface RecipeRequest {
  dishName: string;
  dishDescription: string;
}

function buildRecipePrompt({ dishName, dishDescription }: RecipeRequest): string {
  return `Write a recipe for the following dish:
Name: ${dishName}
Description: ${dishDescription}

Provide a complete list of ingredients with quantities and clear, numbered step-by-step instructions.`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function assertRecipeShape(value: unknown): asserts value is Recipe {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('Unexpected recipe shape: response must be an object');
  }

  const candidate = value as Record<string, unknown>;

  if (!isStringArray(candidate.ingredients)) {
    throw new TypeError('Unexpected recipe shape: ingredients must be an array of strings');
  }

  if (!isStringArray(candidate.instructions)) {
    throw new TypeError('Unexpected recipe shape: instructions must be an array of strings');
  }
}

export function parseRecipeResponse(rawText: string): Recipe {
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Could not parse recipe from Gemini response');
  }

  assertRecipeShape(parsed);
  return parsed;
}

export async function fetchRecipeFromGemini(request: RecipeRequest, apiKey: string): Promise<Recipe> {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        role: 'user',
        parts: [{ text: buildRecipePrompt(request) }],
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

  return parseRecipeResponse(text);
}
