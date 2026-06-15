interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  optional?: boolean;
  animationClass?: string;
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, placeholder, optional, animationClass, onChange }: SelectFieldProps) {
  return (
    <div className={animationClass}>
      <label className="field-label">
        {label}
        {optional && <span className="field-optional">(optional)</span>}
      </label>
      <div className="sel-wrap">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={value ? 'field-select' : 'field-select placeholder'}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <span className="field-chevron">▾</span>
      </div>
    </div>
  );
}
