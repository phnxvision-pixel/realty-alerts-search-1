import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useLandlord } from '@/contexts/LandlordContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'expo-router';
import BetaFeedbackForm from '@/components/BetaFeedbackForm';



export default function SettingsScreen() {
  const { user } = useAuth();
  const { isLandlord } = useLandlord();
  const { language, setLanguage, t } = useLocalization();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);




  useEffect(() => {
    loadSubscriptionStatus();
  }, [user]);

  const loadSubscriptionStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('users')
      .select('subscription_status, subscription_expiry, is_premium')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setIsPremium(data.subscription_status === 'premium' || data.is_premium);
      setSubscriptionExpiry(data.subscription_expiry);
    }
  };

  const handleUpgradeToPremium = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { userId: user.id, email: user.email }
      });
      if (error) throw error;
      if (data?.url) await Linking.openURL(data.url);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'To manage your subscription, please visit the Stripe customer portal.',
      [{ text: 'OK' }]
    );
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'de': return 'Deutsch';
      case 'tr': return 'Türkçe';
      default: return 'English';
    }
  };

  const handleLanguageChange = async (lang: 'en' | 'de' | 'tr') => {
    await setLanguage(lang);
    setShowLanguageModal(false);
  };


  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="settings" size={40} color="#007AFF" />
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        </View>

        {!isPremium && (
          <View style={styles.premiumCard}>
            <Ionicons name="star" size={48} color="#FFD700" />
            <Text style={styles.premiumTitle}>{t('settings.upgradeToPremium')}</Text>
            <Text style={styles.premiumDesc}>{t('settings.premiumDesc')}</Text>
            <Text style={styles.premiumPrice}>{t('settings.premiumPrice')}</Text>
            <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgradeToPremium}>
              <Text style={styles.upgradeText}>{t('settings.upgradeNow')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {isPremium && (
          <View style={styles.premiumActive}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.activeText}>{t('settings.premiumActive')}</Text>
            {subscriptionExpiry && (
              <Text style={styles.expiryText}>
                {t('settings.renewsOn')} {new Date(subscriptionExpiry).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity style={styles.manageBtn} onPress={handleManageSubscription}>
              <Text style={styles.manageBtnText}>{t('settings.manageSubscription')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={20} color="#666" />
            <Text style={styles.menuText}>{t('settings.profile')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          {isPremium && (
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/subscription')}>
              <Ionicons name="diamond" size={20} color="#666" />
              <Text style={styles.menuText}>{t('settings.subscription')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.landlordPortal')}</Text>
          {isLandlord ? (
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/landlord/dashboard')}>
              <Ionicons name="business" size={20} color="#666" />
              <Text style={styles.menuText}>{t('settings.landlordDashboard')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/landlord/register')}>
              <Ionicons name="business" size={20} color="#666" />
              <Text style={styles.menuText}>{t('settings.becomeLandlord')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/notifications')}>
            <Ionicons name="notifications" size={20} color="#666" />
            <Text style={styles.menuText}>{t('settings.notifications')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/privacy-settings')}>
            <Ionicons name="shield-checkmark" size={20} color="#666" />
            <Text style={styles.menuText}>Privacy & Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/messages/settings')}>
            <Ionicons name="mail" size={20} color="#666" />
            <Text style={styles.menuText}>Message Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageModal(true)}>
            <Ionicons name="language" size={20} color="#666" />
            <Text style={styles.menuText}>{t('settings.language')}</Text>
            <Text style={styles.languageValue}>{getLanguageName(language)}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setThemeMode(themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'system' : 'dark')}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color="#666" />
            <Text style={styles.menuText}>Theme</Text>
            <Text style={styles.languageValue}>{themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light'}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beta Testing</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowFeedbackModal(true)}>
            <Ionicons name="bug" size={20} color="#666" />
            <Text style={styles.menuText}>Report Bug / Feedback</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal visible={showFeedbackModal} animationType="slide">
        <BetaFeedbackForm onClose={() => setShowFeedbackModal(false)} />
      </Modal>



      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.languageOption, language === 'en' && styles.selectedLanguage]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.languageText}>English</Text>
              {language === 'en' && <Ionicons name="checkmark" size={24} color="#007AFF" />}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageOption, language === 'de' && styles.selectedLanguage]}
              onPress={() => handleLanguageChange('de')}
            >
              <Text style={styles.languageText}>Deutsch</Text>
              {language === 'de' && <Ionicons name="checkmark" size={24} color="#007AFF" />}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageOption, language === 'tr' && styles.selectedLanguage]}
              onPress={() => handleLanguageChange('tr')}
            >
              <Text style={styles.languageText}>Türkçe</Text>
              {language === 'tr' && <Ionicons name="checkmark" size={24} color="#007AFF" />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 24, alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 12, color: '#333' },
  premiumCard: { backgroundColor: '#007AFF', margin: 16, padding: 24, borderRadius: 12, alignItems: 'center' },
  premiumTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  premiumDesc: { fontSize: 14, color: '#fff', marginTop: 8, textAlign: 'center', opacity: 0.9 },
  premiumPrice: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 12 },
  upgradeBtn: { backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, marginTop: 12 },
  upgradeText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  premiumActive: { backgroundColor: '#fff', margin: 16, padding: 24, borderRadius: 12, alignItems: 'center' },
  activeText: { fontSize: 20, fontWeight: 'bold', marginTop: 12, color: '#333' },
  expiryText: { fontSize: 14, color: '#666', marginTop: 8 },
  manageBtn: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, marginTop: 16 },
  manageBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginLeft: 16, marginBottom: 8 },
  menuItem: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 16, color: '#333', marginLeft: 12, flex: 1 },
  languageValue: { fontSize: 14, color: '#007AFF', marginRight: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  selectedLanguage: { backgroundColor: '#f0f8ff' },
  languageText: { fontSize: 18, color: '#333' },
});


