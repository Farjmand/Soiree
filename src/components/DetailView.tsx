import type { CSSProperties } from 'react';
import { colors, appBackground, cardVariants, glassCardBase } from '../theme';
import { BulletList } from './BulletList';
import type { PartyTheme, FoodItem, DressCode } from '../types';

interface DetailViewProps {
  readonly theme: PartyTheme;
  readonly onBack: () => void;
  readonly onReset: () => void;
}

const sectionLabelStyle: CSSProperties = {
  fontSize: 10,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: colors.gold,
  marginBottom: 16,
};

const cardHeadingStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 22,
  fontWeight: 400,
  color: colors.cream,
  marginBottom: 12,
};

export function DetailView({ theme, onBack, onReset }: Readonly<DetailViewProps>) {
  return (
    <div style={{ ...appBackground, padding: '44px 20px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <button className="back-btn fu" onClick={onBack}>← Back</button>

        <div style={{ textAlign: 'center', margin: '32px 0 44px' }} className="fu1">
          <div style={{ fontSize: 44, marginBottom: 12 }}>{theme.themeEmoji}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: colors.cream }}>
            {theme.themeName}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <ThemeCard theme={theme} />
          <MenuCard foodItems={theme.foodItems} />
          <DressCodeCard dresscode={theme.dresscode} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            className="gen-btn"
            onClick={onReset}
            style={{
              background: colors.gold, color: colors.bg, border: 'none',
              borderRadius: 12, padding: '14px 36px', fontSize: 14,
              fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Generate Another Theme ✨
          </button>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({ theme }: Readonly<{ theme: PartyTheme }>) {
  return (
    <div className="detail-card fu2" style={{ ...glassCardBase, ...cardVariants.theme }}>
      <div style={sectionLabelStyle}>🎨 The Theme</div>
      <h3 style={cardHeadingStyle}>{theme.themeName}</h3>
      <BulletList items={theme.themeDescription} />
    </div>
  );
}

function MenuCard({ foodItems }: Readonly<{ foodItems: FoodItem[] }>) {
  return (
    <div className="detail-card fu3" style={{ ...glassCardBase, ...cardVariants.menu }}>
      <div style={sectionLabelStyle}>🍽️ The Menu</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {foodItems.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            style={{
              paddingBottom: i < foodItems.length - 1 ? 11 : 0,
              borderBottom: i < foodItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <div style={{ color: colors.cream, fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.name}</div>
            <div style={{ color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DressCodeCard({ dresscode }: Readonly<{ dresscode: DressCode }>) {
  return (
    <div className="detail-card fu4" style={{ ...glassCardBase, ...cardVariants.dressCode }}>
      <div style={sectionLabelStyle}>👗 Dress Code</div>
      <h3 style={cardHeadingStyle}>{dresscode.title}</h3>
      <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
        {dresscode.description}
      </p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: colors.gold, marginBottom: 10 }}>
          Colors
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {dresscode.colors.map((col, i) => (
            <span
              key={`${col}-${i}`}
              style={{
                background: 'rgba(213,137,54,0.08)',
                border: '1px solid rgba(213,137,54,0.22)',
                color: colors.gold,
                padding: '4px 11px',
                borderRadius: 20,
                fontSize: 12,
              }}
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(164,66,0,0.1)', border: '1px solid rgba(164,66,0,0.3)', borderRadius: 10, padding: '10px 13px' }}>
        <span style={{ color: colors.red, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Avoid </span>
        <span style={{ color: colors.muted, fontSize: 12 }}>{dresscode.avoid}</span>
      </div>
    </div>
  );
}
