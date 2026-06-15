import { describe, expect, it } from 'vitest';
import { formatRecipeAsMarkdown } from './recipeFormat';
import type { Recipe } from './types';

describe('formatRecipeAsMarkdown', () => {
  it('formats a dish name, ingredients, and instructions as markdown', () => {
    const recipe: Recipe = {
      ingredients: ['2 cups flour', '1 tsp salt'],
      instructions: ['Mix dry ingredients', 'Bake at 350F for 20 minutes'],
    };

    expect(formatRecipeAsMarkdown('Spiced Cider', recipe)).toBe(
      '# Spiced Cider\n\n' +
      '## Ingredients\n' +
      '- 2 cups flour\n' +
      '- 1 tsp salt\n\n' +
      '## Instructions\n' +
      '1. Mix dry ingredients\n' +
      '2. Bake at 350F for 20 minutes',
    );
  });

  it('formats a recipe with a single ingredient and a single instruction', () => {
    const recipe: Recipe = {
      ingredients: ['1 lemon'],
      instructions: ['Squeeze the lemon'],
    };

    expect(formatRecipeAsMarkdown('Lemon Water', recipe)).toBe(
      '# Lemon Water\n\n' +
      '## Ingredients\n' +
      '- 1 lemon\n\n' +
      '## Instructions\n' +
      '1. Squeeze the lemon',
    );
  });

  it('formats a recipe with no ingredients or instructions', () => {
    const recipe: Recipe = { ingredients: [], instructions: [] };

    expect(formatRecipeAsMarkdown('Mystery Dish', recipe)).toBe(
      '# Mystery Dish\n\n' +
      '## Ingredients\n\n' +
      '## Instructions',
    );
  });
});
