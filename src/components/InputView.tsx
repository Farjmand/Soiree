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
    <div className="app-bg">
      <div className="page-narrow">
        <Header />

        <div className="form-stack">
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

          {error && <p className="error-text">{error}</p>}

          <div className="fu4 generate-wrap">
            <GenerateButton loading={loading} onClick={onGenerate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="header fu">
      <div className="header-emoji">🎪</div>
      <h1 className="header-title">
        Throwing a Party?<br />
        <em>We've Got Opinions.</em>
      </h1>
      <p className="header-subtitle">
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
      className="gen-btn generate-btn"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <><span className="spinner" />Conjuring your theme…</> : 'Generate Theme ✨'}
    </button>
  );
}
