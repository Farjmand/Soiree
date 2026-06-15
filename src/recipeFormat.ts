import type { Recipe } from './types';

function formatSection(heading: string, items: string[]): string {
  if (items.length === 0) return heading;
  return `${heading}\n${items.join('\n')}`;
}

function formatIngredients(ingredients: string[]): string {
  return formatSection('## Ingredients', ingredients.map((ingredient) => `- ${ingredient}`));
}

function formatInstructions(instructions: string[]): string {
  return formatSection('## Instructions', instructions.map((instruction, index) => `${index + 1}. ${instruction}`));
}

export function formatRecipeAsMarkdown(dishName: string, recipe: Recipe): string {
  const sections = [`# ${dishName}`, formatIngredients(recipe.ingredients), formatInstructions(recipe.instructions)];

  return sections.join('\n\n');
}
