import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from './lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileCompletionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    phone: '',
    language: 'de',
    userType: '',
    minBudget: '',
    maxBudget: '',
    bedrooms: '',
    preferredLocation: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkip = () => {
    const stepNames = ['phone', 'language', 'user_type', 'preferences'];
    const currentStepName = stepNames[step - 1];
    
    if (!skippedSteps.includes(currentStepName)) {
      setSkippedSteps([...skippedSteps, currentStepName]);
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete(true);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.phone) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihre Telefonnummer ein oder überspringen Sie diesen Schritt');
      return;
    }
    if (step === 3 && !formData.userType) {
      Alert.alert('Fehler', 'Bitte wählen Sie einen Benutzertyp oder überspringen Sie diesen Schritt');
      return;
    }
    if (step < 4) setStep(step + 1);
    else handleComplete(false);
  };

  const handleComplete = async (isSkipping: boolean) => {
    setLoading(true);
    try {
      const updateData: any = {
        onboarding_completed: true,
        skipped_steps: isSkipping ? skippedSteps : []
      };

      if (formData.phone) updateData.phone = formData.phone;
      if (formData.language) updateData.preferred_language = formData.language;
      if (formData.userType) updateData.user_type = formData.userType;

      await supabase.from('users').update(updateData).eq('id', user?.id);

      if (formData.userType === 'tenant' && (formData.minBudget || formData.maxBudget)) {
        await supabase.from('tenant_preferences').upsert({
          user_id: user?.id,
          min_budget: parseInt(formData.minBudget) || null,
          max_budget: parseInt(formData.maxBudget) || null,
          bedrooms: parseInt(formData.bedrooms) || null,
          preferred_location: formData.preferredLocation || null
        });
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Fehler', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepText}>Schritt {step} von 4</Text>
      </View>

      {step === 1 && (
        <View style={styles.stepContainer}>
          <Ionicons name="call-outline" size={60} color="#007AFF" style={styles.icon} />
          <Text style={styles.title}>Telefonnummer</Text>
          <Text style={styles.subtitle}>Damit Vermieter Sie kontaktieren können</Text>
          <TextInput
            style={styles.input}
            placeholder="+49 123 456789"
            value={formData.phone}
            onChangeText={(v) => updateField('phone', v)}
            keyboardType="phone-pad"
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Ionicons name="language-outline" size={60} color="#007AFF" style={styles.icon} />
          <Text style={styles.title}>Bevorzugte Sprache</Text>
          <Text style={styles.subtitle}>Wählen Sie Ihre bevorzugte Sprache</Text>
          {['de', 'en', 'fr', 'es'].map(lang => (
            <TouchableOpacity
              key={lang}
              style={[styles.option, formData.language === lang && styles.optionActive]}
              onPress={() => updateField('language', lang)}
            >
              <Text style={[styles.optionText, formData.language === lang && styles.optionTextActive]}>
                {lang === 'de' ? 'Deutsch' : lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'Español'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Ionicons name="person-outline" size={60} color="#007AFF" style={styles.icon} />
          <Text style={styles.title}>Ich bin...</Text>
          <Text style={styles.subtitle}>Wählen Sie Ihren Benutzertyp</Text>
          <TouchableOpacity
            style={[styles.option, formData.userType === 'tenant' && styles.optionActive]}
            onPress={() => updateField('userType', 'tenant')}
          >
            <Text style={[styles.optionText, formData.userType === 'tenant' && styles.optionTextActive]}>
              Mieter - Ich suche eine Wohnung
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, formData.userType === 'landlord' && styles.optionActive]}
            onPress={() => updateField('userType', 'landlord')}
          >
            <Text style={[styles.optionText, formData.userType === 'landlord' && styles.optionTextActive]}>
              Vermieter - Ich vermiete Wohnungen
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && formData.userType === 'tenant' && (
        <View style={styles.stepContainer}>
          <Ionicons name="home-outline" size={60} color="#007AFF" style={styles.icon} />
          <Text style={styles.title}>Ihre Präferenzen</Text>
          <Text style={styles.subtitle}>Helfen Sie uns, die perfekte Wohnung zu finden</Text>
          <Text style={styles.label}>Budget (€/Monat)</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Min"
              value={formData.minBudget}
              onChangeText={(v) => updateField('minBudget', v)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Max"
              value={formData.maxBudget}
              onChangeText={(v) => updateField('maxBudget', v)}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.label}>Anzahl Schlafzimmer</Text>
          <TextInput
            style={styles.input}
            placeholder="z.B. 2"
            value={formData.bedrooms}
            onChangeText={(v) => updateField('bedrooms', v)}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Bevorzugter Standort</Text>
          <TextInput
            style={styles.input}
            placeholder="z.B. Berlin Mitte"
            value={formData.preferredLocation}
            onChangeText={(v) => updateField('preferredLocation', v)}
          />
        </View>
      )}

      {step === 4 && formData.userType === 'landlord' && (
        <View style={styles.stepContainer}>
          <Ionicons name="checkmark-circle-outline" size={60} color="#007AFF" style={styles.icon} />
          <Text style={styles.title}>Alles bereit!</Text>
          <Text style={styles.subtitle}>Sie können jetzt Ihre Wohnungen verwalten</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Später vervollständigen</Text>
        </TouchableOpacity>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {step === 4 ? 'Fertig' : 'Weiter'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 60 },
  progressBar: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  progressDot: { width: 40, height: 4, backgroundColor: '#ddd', marginHorizontal: 4, borderRadius: 2 },
  progressDotActive: { backgroundColor: '#007AFF' },
  stepText: { textAlign: 'center', color: '#666', fontSize: 14 },
  stepContainer: { padding: 20, alignItems: 'center' },
  icon: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  label: { alignSelf: 'flex-start', fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  halfInput: { width: '48%' },
  option: { width: '100%', padding: 16, borderWidth: 2, borderColor: '#ddd', borderRadius: 8, marginBottom: 12 },
  optionActive: { borderColor: '#007AFF', backgroundColor: '#E3F2FD' },
  optionText: { fontSize: 16, color: '#333', textAlign: 'center' },
  optionTextActive: { color: '#007AFF', fontWeight: '600' },
  footer: { padding: 20, paddingBottom: 40 },
  skipButton: { padding: 12, alignItems: 'center', marginBottom: 8 },
  skipButtonText: { color: '#999', fontSize: 14 },
  backButton: { padding: 16, alignItems: 'center', marginBottom: 12 },
  backButtonText: { color: '#007AFF', fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
