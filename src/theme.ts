import type { CSSProperties } from 'react';

export const colors = {
  bg: '#12071f',
  card: '#1e0f35',
  cardDeep: '#160b28',
  gold: '#D4AF37',
  goldLight: '#E8C840',
  cream: '#F5E6D3',
  muted: '#9b89b5',
  border: 'rgba(212, 175, 55, 0.18)',
  borderHover: 'rgba(212, 175, 55, 0.55)',
  red: '#FF8080',
} as const;

export const appBackground: CSSProperties = {
  minHeight: '100vh',
  background: `radial-gradient(ellipse at 15% 30%, rgba(100,30,160,0.18) 0%, transparent 55%),
               radial-gradient(ellipse at 85% 70%, rgba(212,175,55,0.07) 0%, transparent 50%),
               ${colors.bg}`,
  fontFamily: "'DM Sans', sans-serif",
  color: colors.cream,
};
