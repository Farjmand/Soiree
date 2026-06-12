import { colors, appBackground } from '../theme';
import { BulletList } from './BulletList';
import type { PartyTheme } from '../types';

interface ResultsViewProps {
  readonly theme: PartyTheme;
  readonly onViewDetail: () => void;
  readonly onReset: () => void;
}

export function ResultsView({ theme, onViewDetail, onReset }: Readonly<ResultsViewProps>) {
  return (
    <div style={{ ...appBackground, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ color: colors.muted, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 28 }} className="fu">
          Your theme is ready
        </p>

        <ThemePreviewCard theme={theme} onClick={onViewDetail} />

        <button className="ghost-btn fu2" onClick={onReset} style={{ marginTop: 24 }}>
          Start over
        </button>
      </div>
    </div>
  );
}

interface ThemePreviewCardProps {
  readonly theme: PartyTheme;
  readonly onClick: () => void;
}

function ThemePreviewCard({ theme, onClick }: Readonly<ThemePreviewCardProps>) {
  return (
    <button
      type="button"
      className="preview-card fu1"
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'center', padding: '40px 32px',
        background: 'linear-gradient(140deg, #69140E 0%, #4B1C1B 100%)',
        border: `1px solid ${colors.border}`, borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 180, height: 180,
        background: 'radial-gradient(circle, rgba(213,137,54,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 56, marginBottom: 18 }}>{theme.themeEmoji}</div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 30, fontWeight: 400, color: colors.cream, marginBottom: 14, lineHeight: 1.2,
      }}>
        {theme.themeName}
      </h2>
      <BulletList items={theme.themeDescription} style={{ margin: '0 0 28px', paddingLeft: 0, listStyle: 'none' }} />
      <span style={{ color: colors.gold, fontSize: 12, letterSpacing: '1px' }}>Tap to explore →</span>
    </button>
  );
}
