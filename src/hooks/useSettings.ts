import { useState, useEffect } from 'react';
import { ChatSettings, loadSettings, saveSettings } from '@/helpers/settings_helpers';

export function useSettings() {
  const [settings, setSettings] = useState<ChatSettings>(loadSettings());

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    setSettings(current => {
      const updated = { ...current, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  // Load settings on mount
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  return { settings, updateSettings };
} 