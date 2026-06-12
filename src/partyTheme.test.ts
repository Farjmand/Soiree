import { describe, expect, it } from 'vitest';
import { parsePartyThemeResponse } from './partyTheme';

const validTheme = {
  themeName: 'Neon Nights',
  themeEmoji: '🌃',
  themeDescription: ['Vibrant lights everywhere', 'Synthwave soundtrack', 'Retro-future fashion'],
  foodItems: [{ name: 'Glow Punch', description: 'A glowing fruit punch' }],
  dresscode: {
    title: 'Neon Chic',
    description: 'Wear bold neon colors.',
    colors: ['Pink', 'Cyan', 'Purple'],
    avoid: 'Avoid all-black outfits.',
  },
};

describe('parsePartyThemeResponse', () => {
  it('parses a well-formed JSON response into a PartyTheme', () => {
    expect(parsePartyThemeResponse(JSON.stringify(validTheme))).toEqual(validTheme);
  });

  it('strips markdown code fences before parsing', () => {
    const fenced = '```json\n' + JSON.stringify(validTheme) + '\n```';
    expect(parsePartyThemeResponse(fenced)).toEqual(validTheme);
  });

  it('throws a descriptive error when the response is not valid JSON', () => {
    expect(() => parsePartyThemeResponse('not json at all')).toThrow(
      'Could not parse party theme from Gemini response',
    );
  });

  it('throws when themeDescription is a string instead of an array', () => {
    const malformed = { ...validTheme, themeDescription: 'A single description string' };
    expect(() => parsePartyThemeResponse(JSON.stringify(malformed))).toThrow(
      'Unexpected party theme shape: themeDescription must be an array of strings',
    );
  });

  it('throws when themeDescription contains non-string entries', () => {
    const malformed = { ...validTheme, themeDescription: ['Fine', 42] };
    expect(() => parsePartyThemeResponse(JSON.stringify(malformed))).toThrow(
      'Unexpected party theme shape: themeDescription must be an array of strings',
    );
  });

  it('throws when required top-level fields are missing', () => {
    const { themeName: _themeName, ...withoutThemeName } = validTheme;
    expect(() => parsePartyThemeResponse(JSON.stringify(withoutThemeName))).toThrow(
      'Unexpected party theme shape: themeName must be a string',
    );
  });

  it('throws when themeEmoji is missing', () => {
    const { themeEmoji: _themeEmoji, ...withoutThemeEmoji } = validTheme;
    expect(() => parsePartyThemeResponse(JSON.stringify(withoutThemeEmoji))).toThrow(
      'Unexpected party theme shape: themeEmoji must be a string',
    );
  });

  it('throws when foodItems entries are missing a description', () => {
    const malformed = { ...validTheme, foodItems: [{ name: 'Glow Punch' }] };
    expect(() => parsePartyThemeResponse(JSON.stringify(malformed))).toThrow(
      'Unexpected party theme shape: foodItems must be an array of {name, description}',
    );
  });

  it('throws when dresscode.colors is not an array of strings', () => {
    const malformed = { ...validTheme, dresscode: { ...validTheme.dresscode, colors: 'Pink' } };
    expect(() => parsePartyThemeResponse(JSON.stringify(malformed))).toThrow(
      'Unexpected party theme shape: dresscode must include title, description, colors, and avoid',
    );
  });
});
