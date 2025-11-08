import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const DOCUMENT_TYPES = [
  { key: 'id', label: 'ID/Passport' },
  { key: 'income_proof', label: 'Income Proof' },
  { key: 'employment_contract', label: 'Employment Contract' },
  { key: 'schufa', label: 'SCHUFA Report' },
  { key: 'previous_landlord_reference', label: 'Landlord Reference' },
  { key: 'other', label: 'Other Documents' }
];

export default function DocumentUploader({ conversationId }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload Application Documents</Text>
      <Text style={styles.subtitle}>
        Document upload feature - Install expo-document-picker to enable
      </Text>
      {DOCUMENT_TYPES.map(doc => (
        <View key={doc.key} style={styles.docButton}>
          <Text style={styles.docLabel}>{doc.label}</Text>
          <Text style={styles.uploadText}>Upload</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  docButton: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docLabel: { fontSize: 16, fontWeight: '500' },
  uploadText: { color: '#007AFF', fontWeight: '600' }
});
