import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ThemeColors } from '../theme';
import { getThemeColors } from '../themePresets';
import { DEFAULT_SEASON } from '../constants';

const DEFAULT_VIBE = 'Elegant & Luxurious';

interface ThemeContextValue {
  readonly colors: ThemeColors;
  readonly setThemeFromSelection: (vibe: string, season: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [themeColors, setThemeColors] = useState<ThemeColors>(() => getThemeColors(DEFAULT_VIBE, DEFAULT_SEASON));

  const value = useMemo<ThemeContextValue>(() => ({
    colors: themeColors,
    setThemeFromSelection: (vibe: string, season: string) => setThemeColors(getThemeColors(vibe, season)),
  }), [themeColors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
