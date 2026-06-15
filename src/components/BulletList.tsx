interface BulletListProps {
  readonly items: string[];
  readonly className?: string;
}

export function BulletList({ items, className }: BulletListProps) {
  const listClassName = className ? `bullet-list ${className}` : 'bullet-list';

  return (
    <ul className={listClassName}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`}>{item}</li>
      ))}
    </ul>
  );
}
