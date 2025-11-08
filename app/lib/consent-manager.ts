import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConsentPreferences {
  necessary: boolean; // Always true, can't be disabled
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
}

const CONSENT_KEY = '@wohnsinn_consent_preferences';
const CONSENT_VERSION = '1.0';

export const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
  timestamp: new Date().toISOString(),
};

export const consentManager = {
  async getConsent(): Promise<ConsentPreferences | null> {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Error reading consent:', error);
      return null;
    }
  },

  async setConsent(preferences: ConsentPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify({
        ...preferences,
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  },

  async hasConsent(): Promise<boolean> {
    const consent = await this.getConsent();
    return consent !== null;
  },

  async clearConsent(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONSENT_KEY);
    } catch (error) {
      console.error('Error clearing consent:', error);
    }
  },

  async acceptAll(): Promise<void> {
    await this.setConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
    });
  },

  async rejectNonEssential(): Promise<void> {
    await this.setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
    });
  },
};
