
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import tabsEN from '@/constants/translations/en/tabs.json';
import tabsDE from '@/constants/translations/de/tabs.json';
import tabsFR from '@/constants/translations/fr/tabs.json';
import tabsTR from '@/constants/translations/tr/tabs.json';


export const resources = {
  en: {
    tabs: tabsEN,
  },
  de: {
    tabs: tabsDE,
  },
  fr: {
    tabs: tabsFR,
  },
  tr: {
    tabs: tabsTR,
  }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // default language
    fallbackLng: 'en',
    compatibilityJSON: 'v3', 
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    ns: ['tabs'],
    defaultNS: 'tabs',
  });

export default i18n;
