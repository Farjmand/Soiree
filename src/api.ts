import type { PartyForm, PartyTheme } from './types';

export async function generatePartyTheme(form: PartyForm): Promise<PartyTheme> {
  const response = await fetch('/api/generate-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate party theme (${response.status})`);
  }

  return (await response.json()) as PartyTheme;
}
