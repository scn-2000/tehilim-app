'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setDarkMode: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setFontSize: (v: 'small' | 'medium' | 'large') => void;
}

const SettingsContext = createContext<Settings>({
  darkMode: false,
  highContrast: false,
  fontSize: 'medium',
  setDarkMode: () => {},
  setHighContrast: () => {},
  setFontSize: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [highContrast, setHighContrastState] = useState(false);
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    try {
      setDarkModeState(JSON.parse(localStorage.getItem('pref_darkmode') || 'false'));
      setHighContrastState(JSON.parse(localStorage.getItem('pref_highcontrast') || 'false'));
      const fs = localStorage.getItem('pref_fontsize');
      if (fs === 'small' || fs === 'medium' || fs === 'large') setFontSizeState(fs);
    } catch {}
  }, []);

  function setDarkMode(v: boolean) {
    setDarkModeState(v);
    try { localStorage.setItem('pref_darkmode', JSON.stringify(v)); } catch {}
  }
  function setHighContrast(v: boolean) {
    setHighContrastState(v);
    try { localStorage.setItem('pref_highcontrast', JSON.stringify(v)); } catch {}
  }
  function setFontSize(v: 'small' | 'medium' | 'large') {
    setFontSizeState(v);
    try { localStorage.setItem('pref_fontsize', v); } catch {}
  }

  return (
    <SettingsContext.Provider value={{ darkMode, highContrast, fontSize, setDarkMode, setHighContrast, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
