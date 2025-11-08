import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import { translations } from '@/constants/translations';

type Language = 'en' | 'de' | 'tr';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_language');
      
      if (saved && (saved === 'en' || saved === 'de' || saved === 'tr')) {
        setLanguageState(saved as Language);
      } else {
        const deviceLang = detectDeviceLanguage();
        await AsyncStorage.setItem('app_language', deviceLang);
        setLanguageState(deviceLang);
      }
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize language:', error);
      setInitialized(true);
    }
  };

  const detectDeviceLanguage = (): Language => {
    try {
      const locale = Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale || NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;
      
      if (locale?.startsWith('de')) return 'de';
      if (locale?.startsWith('tr')) return 'tr';
    } catch (e) {}
    return 'en';
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {initialized && children}
    </LocalizationContext.Provider>
  );
}

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider');
  return context;
};
