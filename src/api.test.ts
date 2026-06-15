import { afterEach, describe, expect, it, vi } from 'vitest';
import { generatePartyTheme, generateRecipe } from './api';
import type { PartyForm, PartyTheme, Recipe } from './types';

const form: PartyForm = {
  occasion: 'Birthday',
  vibe: 'Cozy',
  season: 'Autumn',
  culturalFlavor: 'Scandinavian',
  fictionalUniverse: 'Studio Ghibli',
};

const theme: PartyTheme = {
  themeName: 'Forest Lantern Feast',
  themeEmoji: '🏮',
  themeDescription: ['Warm glowing lanterns', 'Earthy autumn colors', 'Soft acoustic music'],
  foodItems: [{ name: 'Spiced Cider', description: 'Hot mulled cider with cinnamon' }],
  dresscode: {
    title: 'Woodland Cozy',
    description: 'Layered knits in warm earth tones.',
    colors: ['Amber', 'Moss', 'Cream'],
    avoid: 'Avoid neon or metallics.',
  },
};

describe('generatePartyTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the form to the local /api/generate-theme proxy and returns the theme', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(theme),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await generatePartyTheme(form);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/generate-theme',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(form),
      }),
    );
    expect(result).toEqual(theme);
  });

  it('throws a descriptive error when the proxy responds with an error status', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 502, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);

    await expect(generatePartyTheme(form)).rejects.toThrow('Failed to generate party theme (502)');
  });
});

describe('generateRecipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const dish = { dishName: 'Spiced Cider', dishDescription: 'Hot mulled cider with cinnamon' };

  const recipe: Recipe = {
    ingredients: ['2 cups apple cider', '1 cinnamon stick'],
    instructions: ['Simmer the cider with the cinnamon stick for 10 minutes'],
  };

  it('posts the dish to the local /api/generate-recipe proxy and returns the recipe', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(recipe),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await generateRecipe(dish);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/generate-recipe',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(dish),
      }),
    );
    expect(result).toEqual(recipe);
  });

  it('throws a descriptive error when the proxy responds with an error status', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 502, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);

    await expect(generateRecipe(dish)).rejects.toThrow('Failed to generate recipe (502)');
  });
});
