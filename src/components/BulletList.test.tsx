import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BulletList } from './BulletList';
import { ThemeProvider } from '../context/ThemeContext';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('BulletList', () => {
  it('renders one list item per entry, in order', () => {
    renderWithTheme(<BulletList items={['Cozy vibes', 'Warm lighting', 'Acoustic music']} />);

    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual(['Cozy vibes', 'Warm lighting', 'Acoustic music']);
  });

  it('renders an empty list when given no items', () => {
    renderWithTheme(<BulletList items={[]} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders duplicate entries as separate list items', () => {
    renderWithTheme(<BulletList items={['Cozy vibes', 'Cozy vibes']} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
