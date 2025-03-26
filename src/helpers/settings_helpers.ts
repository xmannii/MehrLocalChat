interface ChatSettings {
  streaming: boolean;
  temperature: number;
  maxTokens: number;
}

const DEFAULT_SETTINGS: ChatSettings = {
  streaming: true,
  temperature: 0.7,
  maxTokens: 2048,
};

export function loadSettings(): ChatSettings {
  try {
    const settings = window.localStorage.getItem('chat_settings');
    if (settings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<ChatSettings>): void {
  try {
    const currentSettings = loadSettings();
    const newSettings = { ...currentSettings, ...settings };
    window.localStorage.setItem('chat_settings', JSON.stringify(newSettings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export type { ChatSettings }; 