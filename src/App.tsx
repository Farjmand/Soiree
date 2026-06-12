import { useState } from 'react';
import { useGlobalStyles } from './hooks/useGlobalStyles';
import { InputView } from './components/InputView';
import { ResultsView } from './components/ResultsView';
import { DetailView } from './components/DetailView';
import { generatePartyTheme } from './api';
import { DEFAULT_SEASON, DEFAULT_FICTIONAL_UNIVERSE } from './constants';
import type { AppView, PartyForm, PartyTheme } from './types';

const DEFAULT_FORM: PartyForm = {
  occasion: '',
  vibe: '',
  season: DEFAULT_SEASON,
  culturalFlavor: '',
  fictionalUniverse: DEFAULT_FICTIONAL_UNIVERSE,
};

export default function App() {
  useGlobalStyles();

  const [view, setView] = useState<AppView>('input');
  const [form, setForm] = useState<PartyForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PartyTheme | null>(null);
  const [error, setError] = useState('');

  const handleFormChange = (updates: Partial<PartyForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    if (!form.occasion || !form.vibe || !form.culturalFlavor) {
      setError('Please fill in all fields to summon your theme!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const theme = await generatePartyTheme(form);
      setResult(theme);
      setView('results');
    } catch {
      setError('Something went wrong. Give it another shot!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setView('input');
    setResult(null);
    setForm(DEFAULT_FORM);
    setError('');
  };

  if (view === 'input') {
    return (
      <InputView
        form={form}
        loading={loading}
        error={error}
        onChange={handleFormChange}
        onGenerate={handleGenerate}
      />
    );
  }

  if (view === 'results' && result) {
    return (
      <ResultsView
        theme={result}
        onViewDetail={() => setView('detail')}
        onReset={handleReset}
      />
    );
  }

  if (view === 'detail' && result) {
    return (
      <DetailView
        theme={result}
        onBack={() => setView('results')}
        onReset={handleReset}
      />
    );
  }

  return null;
}
