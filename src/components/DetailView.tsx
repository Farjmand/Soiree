import type { CSSProperties } from 'react';
import { colors, appBackground } from '../theme';
import type { PartyTheme, FoodItem, DressCode } from '../types';

interface DetailViewProps {
  theme: PartyTheme;
  onBack: () => void;
  onReset: () => void;
}

const cardStyle: CSSProperties = {
  background: 'linear-gradient(145deg, #221040, #160b28)',
  border: `1px solid ${colors.border}`,
  borderRadius: 20,
  padding: 28,
};

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

export function DetailView({ theme, onBack, onReset }: DetailViewProps) {
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
              background: colors.gold, color: '#12071f', border: 'none',
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

function ThemeCard({ theme }: { theme: PartyTheme }) {
  return (
    <div className="detail-card fu2" style={cardStyle}>
      <div style={sectionLabelStyle}>🎨 The Theme</div>
      <h3 style={cardHeadingStyle}>{theme.themeName}</h3>
      <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.8 }}>{theme.themeDescription}</p>
    </div>
  );
}

function MenuCard({ foodItems }: { foodItems: FoodItem[] }) {
  return (
    <div className="detail-card fu3" style={cardStyle}>
      <div style={sectionLabelStyle}>🍽️ The Menu</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {foodItems.map((item, i) => (
          <div
            key={i}
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

function DressCodeCard({ dresscode }: { dresscode: DressCode }) {
  return (
    <div className="detail-card fu4" style={cardStyle}>
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
              key={i}
              style={{
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.22)',
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

      <div style={{ background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.13)', borderRadius: 10, padding: '10px 13px' }}>
        <span style={{ color: colors.red, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Avoid </span>
        <span style={{ color: colors.muted, fontSize: 12 }}>{dresscode.avoid}</span>
      </div>
    </div>
  );
}
