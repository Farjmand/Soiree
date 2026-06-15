import { describe, expect, it } from 'vitest';
import { colors } from './theme';
import { VIBES, SEASONS } from './constants';
import { getThemeColors, VIBE_PALETTES, SEASON_ACCENTS } from './themePresets';

const THEME_COLOR_KEYS = Object.keys(colors);

describe('getThemeColors', () => {
  it.each(VIBES.flatMap(vibe => SEASONS.map(season => [vibe, season] as const)))(
    'returns a complete color palette for %s + %s',
    (vibe, season) => {
      const theme = getThemeColors(vibe, season);

      THEME_COLOR_KEYS.forEach(key => {
        expect(theme).toHaveProperty(key);
        expect(theme[key as keyof typeof theme]).toBeTruthy();
      });
    }
  );

  it('combines the vibe palette with the season accent', () => {
    const theme = getThemeColors('Garden Party', 'Summer');

    expect(theme.bg).toBe(VIBE_PALETTES['Garden Party'].bg);
    expect(theme.cream).toBe(VIBE_PALETTES['Garden Party'].cream);
    expect(theme.gold).toBe(SEASON_ACCENTS.Summer.gold);
    expect(theme.border).toBe(SEASON_ACCENTS.Summer.border);
  });

  it('falls back to the default palette and accent for unknown vibe/season', () => {
    const theme = getThemeColors('', '');

    expect(theme).toEqual(colors);
  });
});
