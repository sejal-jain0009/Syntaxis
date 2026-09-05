/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

const SETTINGS_STORAGE_KEY = 'syntaxis-settings';

export const defaultSettings = {
  theme: 'dark',
  accent: 'blue',
  defaultLanguage: 'Java',
  fontSize: 'medium',
  tabSize: 2,
  wordWrap: true,
  autoSave: false,
  codingReminders: false,
  practiceReminders: false,
};

const accentValues = {
  blue: ['#63b6ff', '#4d7cff', '#071a2d'],
  mint: ['#64d8b1', '#27a77f', '#06251d'],
  coral: ['#ff9d82', '#e46d5b', '#32130e'],
};

const SettingsContext = createContext(null);

function readStoredSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}'), theme: 'dark' };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStoredSettings);

  useEffect(() => {
    const root = document.documentElement;
    const [accent, accentStrong, buttonText] = accentValues[settings.accent] || accentValues.blue;
    root.dataset.theme = 'dark';
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-strong', accentStrong);
    root.style.setProperty('--button-text', buttonText);
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function updateSetting(name, value) {
    setSettings((currentSettings) => ({ ...currentSettings, [name]: value }));
  }

  function updateSettings(nextSettings) {
    setSettings((currentSettings) => ({ ...currentSettings, ...nextSettings }));
  }

  return <SettingsContext.Provider value={{ settings, updateSetting, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return context;
}
