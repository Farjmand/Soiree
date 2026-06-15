import { describe, expect, it } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { getThemeColors } from '../themePresets';

function ThemeProbe() {
  const { colors, setThemeFromSelection } = useTheme();

  return (
    <div>
      <span data-testid="bg">{colors.bg}</span>
      <span data-testid="gold">{colors.gold}</span>
      <button onClick={() => setThemeFromSelection('Garden Party', 'Winter')}>Change theme</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('provides the default theme colors on mount', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    const defaultTheme = getThemeColors('Elegant & Luxurious', 'Any Season');
    expect(screen.getByTestId('bg').textContent).toBe(defaultTheme.bg);
    expect(screen.getByTestId('gold').textContent).toBe(defaultTheme.gold);
  });

  it('updates the theme colors when setThemeFromSelection is called', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole('button').click();
    });

    const expectedTheme = getThemeColors('Garden Party', 'Winter');
    expect(screen.getByTestId('bg').textContent).toBe(expectedTheme.bg);
    expect(screen.getByTestId('gold').textContent).toBe(expectedTheme.gold);
  });

  it('throws when useTheme is used outside a ThemeProvider', () => {
    function Outside() {
      useTheme();
      return null;
    }

    expect(() => render(<Outside />)).toThrow('useTheme must be used within a ThemeProvider');
  });
});
