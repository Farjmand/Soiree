import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DetailView } from './DetailView';
import { ThemeProvider } from '../context/ThemeContext';
import * as api from '../api';
import type { PartyTheme, Recipe } from '../types';

const theme: PartyTheme = {
  themeName: 'Forest Lantern Feast',
  themeEmoji: '🏮',
  themeDescription: ['Warm glowing lanterns'],
  foodItems: [
    { name: 'Spiced Cider', description: 'Hot mulled cider with cinnamon' },
    { name: 'Roast Squash', description: 'Caramelized squash with sage' },
  ],
  dresscode: {
    title: 'Woodland Cozy',
    description: 'Layered knits in warm earth tones.',
    colors: ['Amber', 'Moss', 'Cream'],
    avoid: 'Avoid neon or metallics.',
  },
};

const recipe: Recipe = {
  ingredients: ['2 cups apple cider', '1 cinnamon stick'],
  instructions: ['Simmer the cider', 'Serve warm'],
};

describe('DetailView dish recipes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens a recipe modal showing the dish name when a dish card is clicked', async () => {
    vi.spyOn(api, 'generateRecipe').mockResolvedValue(recipe);

    render(
      <ThemeProvider>
        <DetailView theme={theme} onBack={() => {}} onReset={() => {}} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));

    expect(screen.getByRole('heading', { name: 'Spiced Cider' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('2 cups apple cider')).toBeInTheDocument());
  });

  it('fetches the recipe using the dish name and description', async () => {
    const generateRecipeMock = vi.spyOn(api, 'generateRecipe').mockResolvedValue(recipe);

    render(
      <ThemeProvider>
        <DetailView theme={theme} onBack={() => {}} onReset={() => {}} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));

    await waitFor(() => expect(generateRecipeMock).toHaveBeenCalledWith({
      dishName: 'Spiced Cider',
      dishDescription: 'Hot mulled cider with cinnamon',
    }));
  });

  it('shows an error message when the recipe request fails', async () => {
    vi.spyOn(api, 'generateRecipe').mockRejectedValue(new Error('Failed to generate recipe (502)'));

    render(
      <ThemeProvider>
        <DetailView theme={theme} onBack={() => {}} onReset={() => {}} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));

    expect(await screen.findByText(/failed to load recipe/i)).toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', async () => {
    vi.spyOn(api, 'generateRecipe').mockResolvedValue(recipe);

    render(
      <ThemeProvider>
        <DetailView theme={theme} onBack={() => {}} onReset={() => {}} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));

    await waitFor(() => expect(screen.getByText('2 cups apple cider')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('heading', { name: 'Spiced Cider' })).not.toBeInTheDocument();
  });

  it('shows the correct recipe and loading state when switching dishes mid-fetch', async () => {
    let resolveCider!: (recipe: Recipe) => void;
    let resolveSquash!: (recipe: Recipe) => void;
    const ciderRecipe = recipe;
    const squashRecipe: Recipe = { ingredients: ['Roast squash'], instructions: ['Roast it'] };

    vi.spyOn(api, 'generateRecipe').mockImplementation(({ dishName }) => {
      if (dishName === 'Spiced Cider') {
        return new Promise((resolve) => { resolveCider = resolve; });
      }
      return new Promise((resolve) => { resolveSquash = resolve; });
    });

    render(
      <ThemeProvider>
        <DetailView theme={theme} onBack={() => {}} onReset={() => {}} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));
    expect(screen.getByRole('heading', { name: 'Spiced Cider' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Roast Squash/ }));
    expect(screen.getByRole('heading', { name: 'Roast Squash' })).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveCider(ciderRecipe);
    await waitFor(() => expect(screen.queryByText('2 cups apple cider')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Roast Squash' })).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveSquash(squashRecipe);
    await waitFor(() => expect(screen.getByText('Roast squash')).toBeInTheDocument());
  });

  it('does not refetch the recipe when the same dish is opened again', async () => {
    const generateRecipeMock = vi.spyOn(api, 'generateRecipe').mockResolvedValue(recipe);

    render(
      <ThemeProvider>
        <DetailView theme={theme} onBack={() => {}} onReset={() => {}} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));
    await waitFor(() => expect(screen.getByText('2 cups apple cider')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    fireEvent.click(screen.getByRole('button', { name: /Spiced Cider/ }));

    await waitFor(() => expect(screen.getByText('2 cups apple cider')).toBeInTheDocument());
    expect(generateRecipeMock).toHaveBeenCalledOnce();
  });
});
