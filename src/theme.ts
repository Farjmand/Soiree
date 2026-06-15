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

export type ThemeColors = { [K in keyof typeof colors]: string };

export function buildThemeCssVars(c: ThemeColors): Record<string, string> {
  return {
    '--color-bg': c.bg,
    '--color-card': c.card,
    '--color-card-deep': c.cardDeep,
    '--color-gold': c.gold,
    '--color-gold-light': c.goldLight,
    '--color-cream': c.cream,
    '--color-muted': c.muted,
    '--color-border': c.border,
    '--color-border-hover': c.borderHover,
    '--color-red': c.red,

    '--app-bg': `radial-gradient(ellipse at 10% 20%, ${c.cardDeep}59 0%, transparent 45%),
               radial-gradient(ellipse at 90% 75%, ${c.gold}2e 0%, transparent 45%),
               radial-gradient(ellipse at 55% 50%, ${c.red}1f 0%, transparent 55%),
               ${c.bg}`,

    '--card-theme-bg': `linear-gradient(145deg, ${c.cardDeep}80, ${c.card}80)`,
    '--card-theme-shadow': `0 8px 32px ${c.cardDeep}59`,
    '--card-menu-bg': `linear-gradient(145deg, ${c.red}80, ${c.bg}80)`,
    '--card-menu-shadow': `0 8px 32px ${c.red}59`,
    '--card-dress-bg': `linear-gradient(145deg, ${c.gold}59, ${c.card}80)`,
    '--card-dress-shadow': `0 8px 32px ${c.gold}4d`,

    '--gold-chip-bg': `${c.gold}14`,
    '--gold-chip-border': `${c.gold}38`,
    '--red-box-bg': `${c.red}1a`,
    '--red-box-border': `${c.red}4d`,

    '--preview-card-bg': `linear-gradient(140deg, ${c.cardDeep} 0%, ${c.card} 100%)`,

    '--gen-btn-hover-shadow': `0 8px 28px ${c.gold}40`,
    '--preview-hover-shadow': `0 24px 60px ${c.gold}2e`,
  };
}
