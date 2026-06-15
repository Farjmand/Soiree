import { useEffect } from 'react';
import { buildThemeCssVars, type ThemeColors } from '../theme';

export function useGlobalStyles(colors: ThemeColors): void {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const cssVars = buildThemeCssVars(colors);

    for (const [name, value] of Object.entries(cssVars)) {
      root.style.setProperty(name, value);
    }

    return () => {
      for (const name of Object.keys(cssVars)) {
        root.style.removeProperty(name);
      }
    };
  }, [colors]);
}
