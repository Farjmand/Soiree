import { colors, type ThemeColors } from './theme';
import { VIBES, SEASONS } from './constants';

type Vibe = (typeof VIBES)[number];
type Season = (typeof SEASONS)[number];

type VibePalette = Pick<ThemeColors, 'bg' | 'card' | 'cardDeep' | 'cream' | 'muted'>;
type SeasonAccent = Pick<ThemeColors, 'gold' | 'goldLight' | 'red' | 'border' | 'borderHover'>;

const DEFAULT_VIBE_PALETTE: VibePalette = {
  bg: colors.bg,
  card: colors.card,
  cardDeep: colors.cardDeep,
  cream: colors.cream,
  muted: colors.muted,
};

const DEFAULT_SEASON_ACCENT: SeasonAccent = {
  gold: colors.gold,
  goldLight: colors.goldLight,
  red: colors.red,
  border: colors.border,
  borderHover: colors.borderHover,
};

export const VIBE_PALETTES: Record<Vibe, VibePalette> = {
  'Elegant & Luxurious': DEFAULT_VIBE_PALETTE,
  'Fun & Playful': {
    bg: '#2A1B3D',
    card: '#3D2A52',
    cardDeep: '#6B3FA0',
    cream: '#FDE8FF',
    muted: '#D6B8E8',
  },
  'Casual & Relaxed': {
    bg: '#1A2E35',
    card: '#25404A',
    cardDeep: '#2F5D62',
    cream: '#E8F4F0',
    muted: '#A8C8C0',
  },
  'Traditional & Cultural': {
    bg: '#2B1810',
    card: '#3F2418',
    cardDeep: '#5C2E1A',
    cream: '#F8E4C8',
    muted: '#D9B98E',
  },
  'Boho & Eclectic': {
    bg: '#33231A',
    card: '#4A3324',
    cardDeep: '#6B4226',
    cream: '#F2E2C8',
    muted: '#CBA98A',
  },
  'Minimalist & Chic': {
    bg: '#1F1F22',
    card: '#2C2C30',
    cardDeep: '#3A3A40',
    cream: '#EDEDEF',
    muted: '#B8B8BE',
  },
  'Maximalist & Bold': {
    bg: '#2E0F2E',
    card: '#421C42',
    cardDeep: '#6B1F6B',
    cream: '#FBE4F4',
    muted: '#D9A8CC',
  },
  'Garden Party': {
    bg: '#1C2A1E',
    card: '#283B2A',
    cardDeep: '#3B5A3E',
    cream: '#EAF2E5',
    muted: '#B8CDAE',
  },
};

export const SEASON_ACCENTS: Record<Season, SeasonAccent> = {
  'Any Season': DEFAULT_SEASON_ACCENT,
  Spring: {
    gold: '#8FB339',
    goldLight: '#B5D66A',
    red: '#E08DA8',
    border: 'rgba(143, 179, 57, 0.2)',
    borderHover: 'rgba(143, 179, 57, 0.6)',
  },
  Summer: {
    gold: '#F2B33D',
    goldLight: '#FFD166',
    red: '#EF6F4C',
    border: 'rgba(242, 179, 61, 0.2)',
    borderHover: 'rgba(242, 179, 61, 0.6)',
  },
  Autumn: {
    gold: '#D5793C',
    goldLight: '#E8A357',
    red: '#B5402A',
    border: 'rgba(213, 121, 60, 0.2)',
    borderHover: 'rgba(213, 121, 60, 0.6)',
  },
  Winter: {
    gold: '#7FA8C9',
    goldLight: '#A8CBE3',
    red: '#5C7D9A',
    border: 'rgba(127, 168, 201, 0.2)',
    borderHover: 'rgba(127, 168, 201, 0.6)',
  },
};

export function getThemeColors(vibe: string, season: string): ThemeColors {
  const vibePalette = VIBE_PALETTES[vibe as Vibe] ?? DEFAULT_VIBE_PALETTE;
  const seasonAccent = SEASON_ACCENTS[season as Season] ?? DEFAULT_SEASON_ACCENT;

  return { ...vibePalette, ...seasonAccent };
}
