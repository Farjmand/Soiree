# Feature Spec: Dish Recipes

## 1. Objective

Currently each generated party theme shows a menu of 6 dishes, each with just a name and a one-line description. Users want to know *how to actually make* a dish they like. This feature lets a user click any dish card to view a full recipe (ingredients + step-by-step instructions), generated on demand via Gemini, and copy it to their clipboard as Markdown.

**Target users**: People using the theme planner to plan a party and who want to cook (or assign cooking of) the suggested dishes.

## 2. Core Features & Acceptance Criteria

### 2.1 Clickable dish cards
- Each item in the Menu card (`MenuCard` in `DetailView.tsx`) is rendered as its own clickable card (button/role="button", keyboard accessible).
- Clicking a dish card opens a **modal overlay** containing the recipe for that dish.
- Modal has a visible close control and closes on backdrop click and `Escape` key.

### 2.2 On-demand recipe generation
- Recipe is **not** generated upfront with the theme — it's fetched only when a dish card is clicked.
- On click: show a loading state in the modal while fetching.
- New endpoint `POST /api/generate-recipe` (mirrors `/api/generate-theme` conventions):
  - Request body: `{ dishName: string, dishDescription: string }`
  - Validates input via type guard, checks `GEMINI_API_KEY`, rate-limited like the existing endpoint.
  - Calls Gemini (new module `src/recipe.ts`, mirroring `partyTheme.ts`) with a system prompt requesting strict JSON:
    ```json
    { "ingredients": ["..."], "instructions": ["..."] }
    ```
  - Validates response shape (`assertRecipeShape`), strips markdown fences, throws on malformed response.
  - Returns `502` on Gemini failure, `500` if API key missing, `400` on bad input.
- New client function `generateRecipe({ dishName, dishDescription }): Promise<Recipe>` in `src/api.ts`.
- **Caching**: once fetched for a dish, cache the recipe in component state for the session so re-opening the same dish doesn't re-fetch.
- On fetch error, show an inline error message in the modal with a retry option (no silent failure).

### 2.3 Recipe content
- Recipe modal displays:
  - Dish name (heading)
  - **Ingredients**: bulleted list (reuse `BulletList` component)
  - **Instructions**: numbered list of steps
- New `Recipe` type in `src/types.ts`:
  ```typescript
  export interface Recipe {
    ingredients: string[];
    instructions: string[];
  }
  ```

### 2.4 Copy recipe
- A "Copy recipe" button in the modal copies the recipe as **Markdown** to the clipboard via `navigator.clipboard.writeText()`:
  ```markdown
  # Dish Name

  ## Ingredients
  - ingredient 1
  - ingredient 2

  ## Instructions
  1. step 1
  2. step 2
  ```
- A pure helper function `formatRecipeAsMarkdown(dishName: string, recipe: Recipe): string` produces this string (independently testable).
- Button shows brief "Copied!" confirmation feedback after a successful copy; handles clipboard failure gracefully (e.g. falls back to showing an error, doesn't throw unhandled).

## 3. Tech Stack & Constraints

- No new dependencies. Continue with: Vite + React 18 + TypeScript, Express server, inline `CSSProperties` styling using existing `theme.ts` tokens (`colors`, `glassCardBase`, `cardVariants`).
- New `RecipeModal` component (no existing modal exists — build using the same glass-card visual language as `MenuCard`/`DetailView`).
- Follow existing rate-limiting pattern (`createRateLimiter`) for the new endpoint.

## 4. Project Structure (new/changed files)

- `src/types.ts` — add `Recipe` interface
- `src/recipe.ts` — Gemini integration: system prompt, `fetchRecipeFromGemini`, `parseRecipeResponse`, `assertRecipeShape` (mirrors `partyTheme.ts`)
- `src/recipe.test.ts` — unit tests for parsing/validation
- `src/api.ts` — add `generateRecipe()` client function
- `src/api.test.ts` — tests for new client function
- `server/app.ts` — add `handleGenerateRecipe` + route registration
- `server/app.test.ts` — tests for new route (validation, success, errors, rate limit)
- `src/components/RecipeModal.tsx` — modal component (ingredients list, instructions list, copy button)
- `src/components/RecipeModal.test.tsx` — open/close, loading, error, copy behavior
- `src/recipeFormat.ts` — `formatRecipeAsMarkdown()` pure helper
- `src/recipeFormat.test.ts` — markdown formatting tests
- `src/components/DetailView.tsx` — make `MenuCard` items clickable, wire up `RecipeModal`, manage open dish / recipe cache state

## 5. Code Style

Follow existing CLAUDE.md conventions:
- Small, single-purpose functions/components (extract `RecipeModal`, `formatRecipeAsMarkdown`, `fetchRecipeFromGemini`, `assertRecipeShape` as separate concerns)
- Type-safe — no `any`, use type guards for unknown JSON shapes (mirror `isFoodItem`/`assertPartyThemeShape` patterns)
- Reuse `BulletList` for ingredients; numbered instructions can be a similar small list component or `<ol>`
- Inline styles using existing `theme.ts` tokens — no new design system

## 6. Testing Strategy (TDD)

Write failing tests first for each unit below, then implement minimal code to pass, then refactor:

- **`recipeFormat.test.ts`**: `formatRecipeAsMarkdown` produces correct Markdown for typical, single-item, and empty ingredient/instruction lists
- **`recipe.test.ts`**: `parseRecipeResponse` parses valid JSON, strips code fences, throws on malformed/missing fields (mirrors `partyTheme.test.ts` if present)
- **`api.test.ts`**: `generateRecipe()` posts to `/api/generate-recipe` with correct body, returns `Recipe`, throws descriptive error on non-OK response
- **`server/app.test.ts`**: `/api/generate-recipe` — 400 on invalid body, 500 on missing API key, 200 with valid recipe on success, 502 on Gemini failure, rate limiting behaves like `/api/generate-theme`
- **`RecipeModal.test.tsx`**: renders ingredients/instructions, shows loading state, shows error + retry on failure, copy button calls clipboard and shows "Copied!" feedback
- **`DetailView.test.tsx`** (extend existing): clicking a dish card opens modal with that dish's name; closing via Escape/backdrop/close button works; second click on same dish doesn't re-fetch (cache)

## 7. Boundaries

- **Always**: keep recipe generation server-side (API key never exposed to client), validate all Gemini responses before use, follow existing rate-limiting and error-response conventions.
- **Ask first**: if Gemini prompt/response shape needs to diverge significantly from the `PartyTheme`/`FoodItem` pattern, or if a UI library/dependency would meaningfully simplify the modal — confirm before adding.
- **Never**: change the existing `/api/generate-theme` response shape or the upfront theme-generation flow; don't introduce a global state management library for this feature.
