import { useEffect, useState } from 'react';
import { BulletList } from './BulletList';
import { formatRecipeAsMarkdown } from '../recipeFormat';
import type { Recipe } from '../types';

interface RecipeModalProps {
  readonly dishName: string;
  readonly recipe: Recipe | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onClose: () => void;
  readonly onRetry: () => void;
}

type CopyStatus = 'idle' | 'copied' | 'failed';

export function RecipeModal({ dishName, recipe, isLoading, error, onClose, onRetry }: RecipeModalProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleCopy() {
    if (!recipe) return;

    try {
      await navigator.clipboard.writeText(formatRecipeAsMarkdown(dishName, recipe));
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  return (
    <div
      data-testid="recipe-modal-backdrop"
      role="presentation"
      className="modal-backdrop"
      onClick={onClose}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <button type="button" aria-label="Close" className="modal-close-btn" onClick={onClose}>✕</button>
        <h3 className="modal-heading">{dishName}</h3>

        {isLoading && <p className="modal-loading-text">Loading recipe…</p>}

        {error && (
          <div>
            <p className="modal-error-text">{error}</p>
            <button type="button" className="modal-retry-btn" onClick={onRetry}>Retry</button>
          </div>
        )}

        {recipe && (
          <>
            <div className="modal-section-label">Ingredients</div>
            <BulletList items={recipe.ingredients} className="modal-list" />

            <div className="modal-section-label">Instructions</div>
            <ol className="modal-list">
              {recipe.instructions.map((step, i) => (
                <li key={`${step}-${i}`}>{step}</li>
              ))}
            </ol>

            <button type="button" className="modal-copy-btn" onClick={handleCopy}>Copy recipe</button>
            {copyStatus === 'copied' && <p className="modal-copied-text">Copied!</p>}
            {copyStatus === 'failed' && <p className="modal-failed-text">Failed to copy recipe</p>}
          </>
        )}
      </div>
    </div>
  );
}
