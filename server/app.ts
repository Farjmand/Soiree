import express, { type Express, type Request, type Response } from 'express';
import { fetchPartyThemeFromGemini } from '../src/partyTheme';
import type { PartyForm } from '../src/types';

const REQUIRED_PARTY_FORM_FIELDS: ReadonlyArray<keyof PartyForm> = [
  'occasion',
  'vibe',
  'season',
  'culturalFlavor',
  'fictionalUniverse',
];

function isPartyForm(value: unknown): value is PartyForm {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return REQUIRED_PARTY_FORM_FIELDS.every((field) => typeof candidate[field] === 'string');
}

async function handleGenerateTheme(request: Request, response: Response): Promise<void> {
  if (!isPartyForm(request.body)) {
    response.status(400).json({ error: 'Request body must include occasion, vibe, season, culturalFlavor, and fictionalUniverse as strings' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(500).json({ error: 'Server is not configured with a Gemini API key' });
    return;
  }

  try {
    const theme = await fetchPartyThemeFromGemini(request.body, apiKey);
    response.status(200).json(theme);
  } catch {
    response.status(502).json({ error: 'Failed to generate party theme' });
  }
}

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.post('/api/generate-theme', handleGenerateTheme);
  return app;
}
