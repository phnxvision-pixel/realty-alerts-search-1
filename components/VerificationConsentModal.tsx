import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';

interface VerificationConsentModalProps {
  visible: boolean;
  onClose: () => void;
  request: any;
}

export default function VerificationConsentModal({
  visible,
  onClose,
  request
}: VerificationConsentModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConsent = async (consentGiven: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('process-verification-consent', {
        body: {
          requestId: request.id,
          consentGiven,
          tenantId: request.tenant_id,
          ipAddress: '0.0.0.0',
          userAgent: 'Mobile App'
        }
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        consentGiven 
          ? 'Consent provided. Verification will begin shortly.' 
          : 'Request declined.'
      );
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels: any = {
    credit_check: 'Credit Check',
    background_check: 'Background Check',
    employment_verification: 'Employment Verification',
    rental_history: 'Rental History Check'
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Ionicons name="shield-checkmark" size={48} color="#3B82F6" />
            <Text style={styles.title}>Verification Consent</Text>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.subtitle}>
              {typeLabels[request?.verification_type] || 'Verification'} Request
            </Text>
            
            <Text style={styles.description}>
              A landlord has requested to verify your {typeLabels[request?.verification_type]?.toLowerCase()}. 
              This verification will help strengthen your rental application.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What happens next:</Text>
              <Text style={styles.infoText}>• Your information will be securely verified</Text>
              <Text style={styles.infoText}>• Results will be shared with the landlord</Text>
              <Text style={styles.infoText}>• You'll receive a verification badge</Text>
              <Text style={styles.infoText}>• Cost: ${request?.cost_amount} (paid by landlord)</Text>
            </View>

            <Text style={styles.consent}>
              By providing consent, you authorize the verification of your information 
              through secure third-party services. Your data will be handled in accordance 
              with privacy regulations.
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => handleConsent(false)}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
              onPress={() => handleConsent(true)}
              disabled={loading}
            >
              <Text style={styles.buttonPrimaryText}>
                {loading ? 'Processing...' : 'Provide Consent'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#FFF', borderRadius: 20, maxHeight: '80%' },
  header: { alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  content: { padding: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 20 },
  infoBox: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, marginBottom: 20 },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#666', marginBottom: 4 },
  consent: { fontSize: 12, color: '#999', lineHeight: 18 },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  button: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#3B82F6' },
  buttonSecondary: { backgroundColor: '#F3F4F6' },
  buttonDisabled: { opacity: 0.5 },
  buttonPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  buttonSecondaryText: { color: '#666', fontSize: 16, fontWeight: '600' },
});
