import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeModal } from './RecipeModal';
import type { Recipe } from '../types';

const recipe: Recipe = {
  ingredients: ['2 cups apple cider', '1 cinnamon stick'],
  instructions: ['Simmer the cider', 'Serve warm'],
};

function renderModal(props: Partial<Parameters<typeof RecipeModal>[0]> = {}) {
  return render(
    <RecipeModal
      dishName="Spiced Cider"
      recipe={null}
      isLoading={false}
      error={null}
      onClose={() => {}}
      onRetry={() => {}}
      {...props}
    />,
  );
}

describe('RecipeModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the dish name as a heading', () => {
    renderModal();
    expect(screen.getByRole('heading', { name: 'Spiced Cider' })).toBeInTheDocument();
  });

  it('shows a loading message while the recipe is being fetched', () => {
    renderModal({ isLoading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows an error message and a retry button when fetching fails', () => {
    const onRetry = vi.fn();
    renderModal({ error: 'Failed to generate recipe', onRetry });

    expect(screen.getByText('Failed to generate recipe')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders ingredients and instructions when the recipe loads', () => {
    renderModal({ recipe });

    expect(screen.getByText('2 cups apple cider')).toBeInTheDocument();
    expect(screen.getByText('1 cinnamon stick')).toBeInTheDocument();
    expect(screen.getByText('Simmer the cider')).toBeInTheDocument();
    expect(screen.getByText('Serve warm')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId('recipe-modal-backdrop'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('copies the recipe as markdown and shows confirmation when the copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderModal({ recipe });

    fireEvent.click(screen.getByRole('button', { name: /copy recipe/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('# Spiced Cider'));
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it('shows an error when copying to the clipboard fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderModal({ recipe });

    fireEvent.click(screen.getByRole('button', { name: /copy recipe/i }));

    expect(await screen.findByText(/failed to copy/i)).toBeInTheDocument();
  });
});
