import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { supabase } from '@/app/lib/supabase';

export function LanguageSync() {
  const { user } = useAuth();
  const { language, setLanguage } = useLocalization();
  const hasLoadedFromSupabase = useRef(false);
  const lastSyncedLanguage = useRef(language);

  // Load language from Supabase when user logs in
  useEffect(() => {
    if (user && !hasLoadedFromSupabase.current) {
      loadLanguageFromSupabase();
      hasLoadedFromSupabase.current = true;
    } else if (!user) {
      hasLoadedFromSupabase.current = false;
    }
  }, [user]);

  // Save language to Supabase when it changes and user is logged in
  useEffect(() => {
    if (user && hasLoadedFromSupabase.current && language !== lastSyncedLanguage.current) {
      saveLanguageToSupabase(language);
      lastSyncedLanguage.current = language;
    }
  }, [language, user]);

  const loadLanguageFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('language_preference')
        .eq('id', user?.id)
        .single();

      if (data?.language_preference && !error) {
        await setLanguage(data.language_preference as 'en' | 'de' | 'tr');
        lastSyncedLanguage.current = data.language_preference as 'en' | 'de' | 'tr';
      }
    } catch (error) {
      console.error('Failed to load language from Supabase:', error);
    }
  };

  const saveLanguageToSupabase = async (lang: string) => {
    try {
      await supabase
        .from('users')
        .update({ language_preference: lang })
        .eq('id', user?.id);
    } catch (error) {
      console.error('Failed to save language to Supabase:', error);
    }
  };

  return null;
}
