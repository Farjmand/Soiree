import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchRecipeFromGemini, parseRecipeResponse } from './recipe';

const validRecipe = {
  ingredients: ['2 cups flour', '1 tsp salt'],
  instructions: ['Mix dry ingredients', 'Bake at 350F for 20 minutes'],
};

describe('parseRecipeResponse', () => {
  it('parses a well-formed JSON response into a Recipe', () => {
    expect(parseRecipeResponse(JSON.stringify(validRecipe))).toEqual(validRecipe);
  });

  it('strips markdown code fences before parsing', () => {
    const fenced = '```json\n' + JSON.stringify(validRecipe) + '\n```';
    expect(parseRecipeResponse(fenced)).toEqual(validRecipe);
  });

  it('throws a descriptive error when the response is not valid JSON', () => {
    expect(() => parseRecipeResponse('not json at all')).toThrow(
      'Could not parse recipe from Gemini response',
    );
  });

  it('throws when ingredients is missing', () => {
    const { ingredients: _ingredients, ...withoutIngredients } = validRecipe;
    expect(() => parseRecipeResponse(JSON.stringify(withoutIngredients))).toThrow(
      'Unexpected recipe shape: ingredients must be an array of strings',
    );
  });

  it('throws when ingredients contains non-string entries', () => {
    const malformed = { ...validRecipe, ingredients: ['Flour', 42] };
    expect(() => parseRecipeResponse(JSON.stringify(malformed))).toThrow(
      'Unexpected recipe shape: ingredients must be an array of strings',
    );
  });

  it('throws when instructions is missing', () => {
    const { instructions: _instructions, ...withoutInstructions } = validRecipe;
    expect(() => parseRecipeResponse(JSON.stringify(withoutInstructions))).toThrow(
      'Unexpected recipe shape: instructions must be an array of strings',
    );
  });

  it('throws when instructions contains non-string entries', () => {
    const malformed = { ...validRecipe, instructions: ['Bake', 42] };
    expect(() => parseRecipeResponse(JSON.stringify(malformed))).toThrow(
      'Unexpected recipe shape: instructions must be an array of strings',
    );
  });
});

describe('fetchRecipeFromGemini', () => {
  const dishRequest = { dishName: 'Spiced Cider', dishDescription: 'Hot mulled cider with cinnamon' };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws when the Gemini response is missing the expected candidates shape', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ candidates: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRecipeFromGemini(dishRequest, 'test-api-key')).rejects.toThrow(
      'Unexpected response from Gemini',
    );
  });

  it('throws when the Gemini request fails with a non-ok status', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRecipeFromGemini(dishRequest, 'test-api-key')).rejects.toThrow(
      'Gemini request failed (503)',
    );
  });

  it('throws when the embedded recipe JSON does not match the expected shape', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: JSON.stringify({ ingredients: ['Flour'] }) }] } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRecipeFromGemini(dishRequest, 'test-api-key')).rejects.toThrow(
      'Unexpected recipe shape: instructions must be an array of strings',
    );
  });
});
