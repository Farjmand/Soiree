import type { CSSProperties } from 'react';
import { colors } from '../theme';

interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  optional?: boolean;
  animationClass?: string;
  onChange: (value: string) => void;
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: colors.gold,
  marginBottom: '8px',
};

const selectStyle: CSSProperties = {
  width: '100%',
  padding: '13px 40px 13px 16px',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'DM Sans', sans-serif",
};

const chevronStyle: CSSProperties = {
  position: 'absolute',
  right: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: colors.gold,
  pointerEvents: 'none',
  fontSize: 11,
};

export function SelectField({ label, value, options, placeholder, optional, animationClass, onChange }: SelectFieldProps) {
  return (
    <div className={animationClass}>
      <label style={labelStyle}>
        {label}
        {optional && (
          <span style={{ textTransform: 'none', letterSpacing: 0, color: colors.muted, fontSize: 11, marginLeft: 6 }}>
            (optional)
          </span>
        )}
      </label>
      <div className="sel-wrap">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...selectStyle, color: value ? colors.cream : colors.muted }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <span style={chevronStyle}>▾</span>
      </div>
    </div>
  );
}
