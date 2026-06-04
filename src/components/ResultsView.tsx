import { colors, appBackground } from '../theme';
import type { PartyTheme } from '../types';

interface ResultsViewProps {
  theme: PartyTheme;
  onViewDetail: () => void;
  onReset: () => void;
}

export function ResultsView({ theme, onViewDetail, onReset }: ResultsViewProps) {
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
  theme: PartyTheme;
  onClick: () => void;
}

function ThemePreviewCard({ theme, onClick }: ThemePreviewCardProps) {
  return (
    <div
      className="preview-card fu1"
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'center', padding: '40px 32px',
        background: 'linear-gradient(140deg, #271545 0%, #160b28 100%)',
        border: `1px solid ${colors.border}`, borderRadius: 24,
        boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 180, height: 180,
        background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 56, marginBottom: 18 }}>{theme.themeEmoji}</div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 30, fontWeight: 400, color: colors.cream, marginBottom: 14, lineHeight: 1.2,
      }}>
        {theme.themeName}
      </h2>
      <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
        {theme.themeDescription}
      </p>
      <span style={{ color: colors.gold, fontSize: 12, letterSpacing: '1px' }}>Tap to explore →</span>
    </div>
  );
}
