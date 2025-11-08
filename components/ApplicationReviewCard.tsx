import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { theme } from '@/constants/theme';
import VerificationRequestModal from './VerificationRequestModal';
import VerificationResults from './VerificationResults';

interface ApplicationReviewCardProps {
  application: any;
  onUpdate: () => void;
}

export default function ApplicationReviewCard({ application, onUpdate }: ApplicationReviewCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchVerificationResults();
  }, [application.id]);

  const fetchVerificationResults = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_results')
        .select('*')
        .eq('tenant_id', application.tenant_id);
      
      if (!error && data) {
        setVerificationResults(data);
      }
    } catch (error) {
      console.error('Error fetching verification results:', error);
    }
  };


  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error: appError } = await supabase
        .from('rental_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', application.id);

      if (appError) throw appError;

      const { error: historyError } = await supabase
        .from('application_status_history')
        .insert({
          application_id: application.id,
          old_status: application.status,
          new_status: newStatus,
          notes: notes || null
        });

      if (historyError) throw historyError;

      Alert.alert('Success', 'Application status updated');
      setShowNotes(false);
      setNotes('');
      onUpdate();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{application.full_name}</Text>
      <Text style={styles.detail}>Email: {application.email}</Text>
      <Text style={styles.detail}>Phone: {application.phone}</Text>
      <Text style={styles.detail}>Income: €{application.monthly_income}/mo</Text>
      <Text style={styles.detail}>Move-in: {application.move_in_date}</Text>
      
      {verificationResults.length > 0 && (
        <TouchableOpacity 
          style={styles.verificationButton}
          onPress={() => setShowResults(!showResults)}
        >
          <Text style={styles.verificationButtonText}>
            View Verification Results ({verificationResults.length})
          </Text>
        </TouchableOpacity>
      )}

      {showResults && <VerificationResults results={verificationResults} />}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.verifyButton]} 
          onPress={() => setShowVerificationModal(true)}
        >
          <Text style={styles.buttonText}>Request Verification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.approveButton]} 
          onPress={() => updateStatus('approved')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]} 
          onPress={() => updateStatus('rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>

      <VerificationRequestModal
        visible={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          fetchVerificationResults();
        }}
        applicationId={application.id}
        tenantId={application.tenant_id}
      />


      <Modal visible={showNotes} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Optional notes..."
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowNotes(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 16, marginBottom: 16, borderRadius: 12 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  detail: { color: '#6b7280', marginBottom: 4 },
  verificationButton: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginTop: 12 },
  verificationButtonText: { color: '#3B82F6', fontWeight: '600', textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  verifyButton: { backgroundColor: '#3B82F6' },
  approveButton: { backgroundColor: '#22c55e' },
  rejectButton: { backgroundColor: '#ef4444' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  notesInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, height: 100 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }
});

