import { colors, appBackground } from '../theme';
import { OCCASIONS, VIBES, SEASONS, CULTURAL_FLAVORS } from '../constants';
import { SelectField } from './SelectField';
import type { PartyForm } from '../types';

interface InputViewProps {
  form: PartyForm;
  loading: boolean;
  error: string;
  onChange: (updates: Partial<PartyForm>) => void;
  onGenerate: () => void;
}

export function InputView({ form, loading, error, onChange, onGenerate }: InputViewProps) {
  return (
    <div style={appBackground}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '52px 24px' }}>
        <Header />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SelectField
            label="Occasion"
            value={form.occasion}
            options={OCCASIONS}
            placeholder="Select an occasion"
            animationClass="fu1"
            onChange={val => onChange({ occasion: val })}
          />
          <SelectField
            label="Vibe"
            value={form.vibe}
            options={VIBES}
            placeholder="Select a vibe"
            animationClass="fu2"
            onChange={val => onChange({ vibe: val })}
          />
          <SelectField
            label="Season"
            value={form.season}
            options={SEASONS}
            optional
            animationClass="fu3"
            onChange={val => onChange({ season: val })}
          />
          <SelectField
            label="Cultural Flavor"
            value={form.culturalFlavor}
            options={CULTURAL_FLAVORS}
            placeholder="Select a cultural flavor"
            animationClass="fu3"
            onChange={val => onChange({ culturalFlavor: val })}
          />

          {error && (
            <p style={{ color: colors.red, fontSize: 13, textAlign: 'center' }}>{error}</p>
          )}

          <div className="fu4" style={{ marginTop: 6 }}>
            <GenerateButton loading={loading} onClick={onGenerate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 44 }} className="fu">
      <div style={{ fontSize: 48, marginBottom: 14 }}>🪩</div>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 40, fontWeight: 300, lineHeight: 1.15, color: colors.cream,
      }}>
        Party Theme<br />
        <em style={{ color: colors.gold }}>Generator</em>
      </h1>
      <p style={{ color: colors.muted, marginTop: 12, fontSize: 13, letterSpacing: '0.4px' }}>
        Tell us the vibe. We'll do the planning.
      </p>
    </div>
  );
}

interface GenerateButtonProps {
  loading: boolean;
  onClick: () => void;
}

function GenerateButton({ loading, onClick }: GenerateButtonProps) {
  return (
    <button
      className="gen-btn"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '15px', borderRadius: 12, border: 'none',
        background: loading ? 'rgba(212,175,55,0.35)' : colors.gold,
        color: loading ? 'rgba(18,7,31,0.5)' : '#12071f',
        fontSize: 14, fontWeight: 500, letterSpacing: '0.4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {loading ? <><span className="spinner" />Conjuring your theme…</> : 'Generate Theme ✨'}
    </button>
  );
}
