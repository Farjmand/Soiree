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

const MAX_PARTY_FORM_FIELD_LENGTH = 100;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

function isPartyForm(value: unknown): value is PartyForm {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return REQUIRED_PARTY_FORM_FIELDS.every((field) => {
    const fieldValue = candidate[field];
    return typeof fieldValue === 'string' && fieldValue.length <= MAX_PARTY_FORM_FIELD_LENGTH;
  });
}

function createRateLimiter(windowMs: number, maxRequests: number) {
  const requestTimestampsByClient = new Map<string, number[]>();

  return function rateLimit(request: Request, response: Response, next: () => void): void {
    const clientId = request.ip ?? 'unknown';
    const now = Date.now();
    const recentTimestamps = (requestTimestampsByClient.get(clientId) ?? [])
      .filter((timestamp) => now - timestamp < windowMs);

    if (recentTimestamps.length >= maxRequests) {
      response.status(429).json({ error: 'Too many requests, please try again later' });
      return;
    }

    recentTimestamps.push(now);
    requestTimestampsByClient.set(clientId, recentTimestamps);
    next();
  };
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
  app.post('/api/generate-theme', createRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS), handleGenerateTheme);
  return app;
}
