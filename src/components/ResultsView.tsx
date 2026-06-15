import { BulletList } from './BulletList';
import type { PartyTheme } from '../types';

interface ResultsViewProps {
  readonly theme: PartyTheme;
  readonly onViewDetail: () => void;
  readonly onReset: () => void;
}

export function ResultsView({ theme, onViewDetail, onReset }: Readonly<ResultsViewProps>) {
  return (
    <div className="app-bg page-centered">
      <div className="page-results">
        <p className="results-eyebrow fu">
          Your theme is ready
        </p>

        <ThemePreviewCard theme={theme} onClick={onViewDetail} />

        <button className="ghost-btn fu2 start-over-btn" onClick={onReset}>
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
      className="preview-card preview-card-content fu1"
      onClick={onClick}
    >
      <div className="preview-card-glow" />
      <div className="preview-emoji">{theme.themeEmoji}</div>
      <h2 className="preview-title">
        {theme.themeName}
      </h2>
      <BulletList items={theme.themeDescription} className="preview-bullets" />
      <span className="preview-cta">Tap to explore →</span>
    </button>
  );
}
