import type { PartyForm, PartyTheme, Recipe } from './types';
import type { RecipeRequest } from './recipe';

export async function generatePartyTheme(form: PartyForm): Promise<PartyTheme> {
  const response = await fetch('/api/generate-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate party theme (${response.status})`);
  }

  return (await response.json()) as PartyTheme;
}

export async function generateRecipe(dish: RecipeRequest): Promise<Recipe> {
  const response = await fetch('/api/generate-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate recipe (${response.status})`);
  }

  return (await response.json()) as Recipe;
}
