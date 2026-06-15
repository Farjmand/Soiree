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

describe('createApp', () => {
  it('trusts exactly one reverse proxy hop when resolving the client IP', () => {
    const app = createApp();
    expect(app.get('trust proxy')).toBe(1);
  });
});

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

  it('returns 400 when a form field exceeds the maximum allowed length', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const oversizedForm = { ...validForm, vibe: 'x'.repeat(101) };

    const response = await request(createApp()).post('/api/generate-theme').send(oversizedForm);

    expect(response.status).toBe(400);
  });

  it('returns 429 once a client exceeds the request rate limit', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const app = createApp();
    const responses = [];
    for (let i = 0; i < 21; i++) {
      responses.push(await request(app).post('/api/generate-theme').send(validForm));
    }

    expect(responses.at(-1)?.status).toBe(429);
    expect(responses.slice(0, 20).every((response) => response.status === 200)).toBe(true);
  });
});

const validDish = {
  dishName: 'Spiced Cider',
  dishDescription: 'Hot mulled cider with cinnamon',
};

const geminiRecipeSuccessBody = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify({
              ingredients: ['2 cups apple cider', '1 cinnamon stick'],
              instructions: ['Simmer the cider with the cinnamon stick for 10 minutes'],
            }),
          },
        ],
      },
    },
  ],
};

describe('POST /api/generate-recipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('returns the generated recipe when Gemini responds successfully', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiRecipeSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-recipe').send(validDish);

    expect(response.status).toBe(200);
    expect(response.body.ingredients).toEqual(['2 cups apple cider', '1 cinnamon stick']);
    expect(response.body.instructions).toHaveLength(1);
  });

  it('never forwards the Gemini API key to the client response', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'super-secret-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiRecipeSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-recipe').send(validDish);

    expect(JSON.stringify(response.body)).not.toContain('super-secret-key');
  });

  it('sends the API key to Gemini via a request header, not the client', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiRecipeSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    await request(createApp()).post('/api/generate-recipe').send(validDish);

    const [, requestInit] = fetchMock.mock.calls[0];
    expect(requestInit.headers['x-goog-api-key']).toBe('test-server-side-key');
  });

  it('returns 400 when the dish payload is missing required fields', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const { dishName: _dishName, ...incompleteDish } = validDish;

    const response = await request(createApp()).post('/api/generate-recipe').send(incompleteDish);

    expect(response.status).toBe(400);
  });

  it('returns 502 when Gemini responds with an error status', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-recipe').send(validDish);

    expect(response.status).toBe(502);
  });

  it('returns 502 when Gemini responds with a recipe that does not match the expected shape', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: JSON.stringify({ ingredients: ['2 cups apple cider'] }) }] } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(createApp()).post('/api/generate-recipe').send(validDish);

    expect(response.status).toBe(502);
  });

  it('returns 500 when GEMINI_API_KEY is not configured on the server', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    const response = await request(createApp()).post('/api/generate-recipe').send(validDish);

    expect(response.status).toBe(500);
  });

  it('returns 400 when a dish field exceeds the maximum allowed length', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const oversizedDish = { ...validDish, dishDescription: 'x'.repeat(101) };

    const response = await request(createApp()).post('/api/generate-recipe').send(oversizedDish);

    expect(response.status).toBe(400);
  });

  it('returns 429 once a client exceeds the request rate limit', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-server-side-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(geminiRecipeSuccessBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const app = createApp();
    const responses = [];
    for (let i = 0; i < 21; i++) {
      responses.push(await request(app).post('/api/generate-recipe').send(validDish));
    }

    expect(responses.at(-1)?.status).toBe(429);
    expect(responses.slice(0, 20).every((response) => response.status === 200)).toBe(true);
  });
});
