// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './app';

const validForm = {
  occasion: 'Birthday',
  vibe: 'Cozy',
  season: 'Autumn',
  culturalFlavor: 'Scandinavian',
  fictionalUniverse: 'Studio Ghibli',
};

const geminiSuccessBody = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify({
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
            }),
          },
        ],
      },
    },
  ],
};

describe('POST /api/generate-theme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('returns the generated theme when Gemini responds successfully', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-theme').send(validForm);

    expect(response.status).toBe(200);
    expect(response.body.themeName).toBe('Forest Lantern Feast');
    expect(response.body.themeDescription).toHaveLength(3);
  });

  it('never forwards the Gemini API key to the client response', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'super-secret-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-theme').send(validForm);

    expect(JSON.stringify(response.body)).not.toContain('super-secret-key');
  });

  it('sends the API key to Gemini via a request header, not the client', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    await request(createApp()).post('/api/generate-theme').send(validForm);

    const [, requestInit] = fetchMock.mock.calls[0];
    expect(requestInit.headers['x-goog-api-key']).toBe('test-server-side-key');
  });

  it('returns 400 when the form payload is missing required fields', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const { occasion: _occasion, ...incompleteForm } = validForm;

    const response = await request(createApp()).post('/api/generate-theme').send(incompleteForm);

    expect(response.status).toBe(400);
  });

  it('returns 502 when Gemini responds with an error status', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-theme').send(validForm);

    expect(response.status).toBe(502);
  });

  it('returns 500 when GEMINI_API_KEY is not configured on the server', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    const response = await request(createApp()).post('/api/generate-theme').send(validForm);

    expect(response.status).toBe(500);
  });
});
