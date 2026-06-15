import { useState } from 'react';
import { BulletList } from './BulletList';
import { RecipeModal } from './RecipeModal';
import { generateRecipe } from '../api';
import type { PartyTheme, FoodItem, DressCode, Recipe } from '../types';

interface DetailViewProps {
  readonly theme: PartyTheme;
  readonly onBack: () => void;
  readonly onReset: () => void;
}

export function DetailView({ theme, onBack, onReset }: Readonly<DetailViewProps>) {
  const recipes = useDishRecipes();

  return (
    <div className="app-bg page-detail">
      <div className="page-wide">
        <button className="back-btn fu" onClick={onBack}>← Back</button>

        <div className="detail-hero fu1">
          <div className="detail-hero-emoji">{theme.themeEmoji}</div>
          <h1 className="detail-hero-title">
            {theme.themeName}
          </h1>
        </div>

        <div className="card-grid">
          <ThemeCard theme={theme} />
          <MenuCard foodItems={theme.foodItems} onSelectDish={recipes.openRecipe} />
          <DressCodeCard dresscode={theme.dresscode} />
        </div>

        <div className="detail-footer">
          <button className="gen-btn regenerate-btn" onClick={onReset}>
            Generate Another Theme ✨
          </button>
        </div>
      </div>

      {recipes.selectedDish && (
        <RecipeModal
          dishName={recipes.selectedDish.name}
          recipe={recipes.recipe}
          isLoading={recipes.isLoading}
          error={recipes.error}
          onClose={recipes.closeRecipe}
          onRetry={recipes.retry}
        />
      )}
    </div>
  );
}

interface DishRecipes {
  readonly selectedDish: FoodItem | null;
  readonly recipe: Recipe | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly openRecipe: (dish: FoodItem) => void;
  readonly closeRecipe: () => void;
  readonly retry: () => void;
}

function useDishRecipes(): DishRecipes {
  const [selectedDish, setSelectedDish] = useState<FoodItem | null>(null);
  const [recipeCache, setRecipeCache] = useState<Record<string, Recipe>>({});
  const [loadingDishNames, setLoadingDishNames] = useState<ReadonlySet<string>>(new Set());
  const [errorsByDish, setErrorsByDish] = useState<Record<string, string>>({});

  async function loadRecipe(dish: FoodItem): Promise<void> {
    setLoadingDishNames((names) => new Set(names).add(dish.name));
    setErrorsByDish(({ [dish.name]: _removed, ...rest }) => rest);

    try {
      const recipe = await generateRecipe({ dishName: dish.name, dishDescription: dish.description });
      setRecipeCache((cache) => ({ ...cache, [dish.name]: recipe }));
    } catch {
      setErrorsByDish((errors) => ({ ...errors, [dish.name]: 'Failed to load recipe. Please try again.' }));
    } finally {
      setLoadingDishNames((names) => {
        const next = new Set(names);
        next.delete(dish.name);
        return next;
      });
    }
  }

  function openRecipe(dish: FoodItem): void {
    setSelectedDish(dish);

    if (!recipeCache[dish.name] && !loadingDishNames.has(dish.name)) {
      void loadRecipe(dish);
    }
  }

  function closeRecipe(): void {
    setSelectedDish(null);
  }

  function retry(): void {
    if (selectedDish) void loadRecipe(selectedDish);
  }

  return {
    selectedDish,
    recipe: selectedDish ? recipeCache[selectedDish.name] ?? null : null,
    isLoading: selectedDish ? loadingDishNames.has(selectedDish.name) : false,
    error: selectedDish ? errorsByDish[selectedDish.name] ?? null : null,
    openRecipe,
    closeRecipe,
    retry,
  };
}

function ThemeCard({ theme }: Readonly<{ theme: PartyTheme }>) {
  return (
    <div className="detail-card fu2 glass-card card-theme">
      <div className="section-label">🎨 The Theme</div>
      <h3 className="card-heading">{theme.themeName}</h3>
      <BulletList items={theme.themeDescription} />
    </div>
  );
}

interface MenuCardProps {
  readonly foodItems: FoodItem[];
  readonly onSelectDish: (dish: FoodItem) => void;
}

function MenuCard({ foodItems, onSelectDish }: MenuCardProps) {
  return (
    <div className="detail-card fu3 glass-card card-menu">
      <div className="section-label">🍽️ The Menu</div>
      <div className="menu-list">
        {foodItems.map((item, i) => (
          <button
            type="button"
            key={`${item.name}-${i}`}
            onClick={() => onSelectDish(item)}
            className="menu-item"
          >
            <div className="menu-item-name">{item.name}</div>
            <div className="menu-item-desc">{item.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DressCodeCard({ dresscode }: Readonly<{ dresscode: DressCode }>) {
  return (
    <div className="detail-card fu4 glass-card card-dress-code">
      <div className="section-label">👗 Dress Code</div>
      <h3 className="card-heading">{dresscode.title}</h3>
      <p className="dress-description">
        {dresscode.description}
      </p>

      <div className="dress-colors-section">
        <div className="dress-colors-label">
          Colors
        </div>
        <div className="dress-colors-list">
          {dresscode.colors.map((col, i) => (
            <span key={`${col}-${i}`} className="dress-color-chip">
              {col}
            </span>
          ))}
        </div>
      </div>

      <div className="dress-avoid-box">
        <span className="dress-avoid-label">Avoid </span>
        <span className="dress-avoid-text">{dresscode.avoid}</span>
      </div>
    </div>
  );
}
