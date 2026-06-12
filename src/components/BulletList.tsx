import type { CSSProperties } from 'react';
import { colors } from '../theme';

const bulletListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: colors.muted,
  fontSize: 13,
  lineHeight: 1.8,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

interface BulletListProps {
  readonly items: string[];
  readonly style?: CSSProperties;
}

export function BulletList({ items, style }: BulletListProps) {
  return (
    <ul style={{ ...bulletListStyle, ...style }}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`}>{item}</li>
      ))}
    </ul>
  );
}
