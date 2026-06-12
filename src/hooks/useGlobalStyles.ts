import { useEffect } from 'react';
import { colors } from '../theme';

export function useGlobalStyles(): void {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${colors.bg}; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .fu  { animation: fadeUp 0.5s ease both; }
      .fu1 { animation: fadeUp 0.5s 0.08s ease both; }
      .fu2 { animation: fadeUp 0.5s 0.16s ease both; }
      .fu3 { animation: fadeUp 0.5s 0.24s ease both; }
      .fu4 { animation: fadeUp 0.5s 0.32s ease both; }

      select { appearance: none; -webkit-appearance: none; cursor: pointer; }
      select option { background: ${colors.card}; color: ${colors.cream}; }

      .sel-wrap { position: relative; background: ${colors.card}; border: 1px solid ${colors.border}; border-radius: 12px; transition: border-color 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
      .sel-wrap:focus-within { border-color: ${colors.borderHover}; }

      .gen-btn { transition: all 0.2s ease; }
      .gen-btn:hover:not(:disabled) { background: ${colors.goldLight} !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(213,137,54,0.25) !important; }
      .gen-btn:active:not(:disabled) { transform: translateY(0); }

      .preview-card { transition: all 0.3s ease; cursor: pointer; }
      .preview-card:hover { transform: translateY(-5px); border-color: ${colors.borderHover} !important; box-shadow: 0 24px 60px rgba(213,137,54,0.18) !important; }

      .detail-card { transition: transform 0.25s ease; }
      .detail-card:hover { transform: translateY(-3px); }

      .ghost-btn { background: transparent; border: none; color: ${colors.muted}; font-family: 'DM Sans', sans-serif; cursor: pointer; font-size: 13px; text-decoration: underline; text-underline-offset: 3px; }
      .ghost-btn:hover { color: ${colors.cream}; }

      .back-btn { background: transparent; border: none; color: ${colors.muted}; font-family: 'DM Sans', sans-serif; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; padding: 0; }
      .back-btn:hover { color: ${colors.cream}; }

      .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: ${colors.bg}; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
    `;
    document.head.appendChild(style);

    return () => {
      link.remove();
      style.remove();
    };
  }, []);
}
