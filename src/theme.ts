import type { CSSProperties } from 'react';

export const colors = {
  bg: '#3C1518',
  card: '#4B1C1B',
  cardDeep: '#69140E',
  gold: '#D58936',
  goldLight: '#E8A85C',
  cream: '#F4DEC2',
  muted: '#D2A788',
  border: 'rgba(213, 137, 54, 0.2)',
  borderHover: 'rgba(213, 137, 54, 0.6)',
  red: '#A44200',
} as const;

export const cardVariants: Record<'theme' | 'menu' | 'dressCode', CSSProperties> = {
  theme: {
    background: 'linear-gradient(145deg, rgba(105,20,14,0.5), rgba(75,28,27,0.5))',
    boxShadow: '0 8px 32px rgba(105,20,14,0.35)',
  },
  menu: {
    background: 'linear-gradient(145deg, rgba(164,66,0,0.5), rgba(60,21,24,0.5))',
    boxShadow: '0 8px 32px rgba(164,66,0,0.35)',
  },
  dressCode: {
    background: 'linear-gradient(145deg, rgba(213,137,54,0.35), rgba(75,28,27,0.5))',
    boxShadow: '0 8px 32px rgba(213,137,54,0.3)',
  },
};

export const glassCardBase: CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 28,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
};

export const appBackground: CSSProperties = {
  minHeight: '100vh',
  background: `radial-gradient(ellipse at 10% 20%, rgba(105,20,14,0.35) 0%, transparent 45%),
               radial-gradient(ellipse at 90% 75%, rgba(213,137,54,0.18) 0%, transparent 45%),
               radial-gradient(ellipse at 55% 50%, rgba(164,66,0,0.12) 0%, transparent 55%),
               ${colors.bg}`,
  fontFamily: "'DM Sans', sans-serif",
  color: colors.cream,
};
