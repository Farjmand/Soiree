import { colors, appBackground } from '../theme';
import { OCCASIONS, VIBES, SEASONS, CULTURAL_FLAVORS, FICTIONAL_UNIVERSES } from '../constants';
import { SelectField } from './SelectField';
import type { PartyForm } from '../types';

interface InputViewProps {
  readonly form: PartyForm;
  readonly loading: boolean;
  readonly error: string;
  readonly onChange: (updates: Partial<PartyForm>) => void;
  readonly onGenerate: () => void;
}

export function InputView({ form, loading, error, onChange, onGenerate }: Readonly<InputViewProps>) {
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
          <SelectField
            label="Fictional Inspiration"
            value={form.fictionalUniverse}
            options={FICTIONAL_UNIVERSES}
            optional
            animationClass="fu4"
            onChange={val => onChange({ fictionalUniverse: val })}
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
      <div style={{ fontSize: 48, marginBottom: 14 }}>🎪</div>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 40, fontWeight: 300, lineHeight: 1.15, color: colors.cream,
      }}>
        Throwing a Party?<br />
        <em style={{ color: colors.gold }}>We've Got Opinions.</em>
      </h1>
      <p style={{ color: colors.muted, marginTop: 12, fontSize: 13, letterSpacing: '0.4px' }}>
        Fill in the fields. We'll act like we know what we're doing.
      </p>
    </div>
  );
}

interface GenerateButtonProps {
  readonly loading: boolean;
  readonly onClick: () => void;
}

function GenerateButton({ loading, onClick }: Readonly<GenerateButtonProps>) {
  return (
    <button
      className="gen-btn"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '15px', borderRadius: 12, border: 'none',
        background: loading ? 'rgba(213,137,54,0.5)' : colors.gold,
        color: colors.bg,
        fontSize: 14, fontWeight: 500, letterSpacing: '0.4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {loading ? <><span className="spinner" />Conjuring your theme…</> : 'Generate Theme ✨'}
    </button>
  );
}
