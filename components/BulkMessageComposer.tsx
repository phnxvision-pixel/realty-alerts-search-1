import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/app/lib/supabase';

interface Property {
  id: string;
  title: string;
  address: string;
}

interface BulkMessageComposerProps {
  landlordId: string;
  onClose: () => void;
  onSent: () => void;
}

export default function BulkMessageComposer({ landlordId, onClose, onSent }: BulkMessageComposerProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'properties' | 'custom'>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);
  const [scheduleDate, setScheduleDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
    calculateRecipients();
  }, [filterType, selectedProperties]);

  const loadProperties = async () => {
    const { data } = await supabase
      .from('apartments')
      .select('id, title, address')
      .eq('landlord_id', landlordId);
    if (data) setProperties(data);
  };

  const calculateRecipients = async () => {
    let query = supabase.from('conversations').select('user_id', { count: 'exact', head: true });
    
    if (filterType === 'properties' && selectedProperties.length > 0) {
      query = query.in('apartment_id', selectedProperties);
    }
    
    const { count } = await query;
    setRecipientCount(count || 0);
  };

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in subject and message');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-message', {
        body: {
          landlordId,
          subject,
          message,
          recipientFilter: {
            type: filterType,
            property_ids: selectedProperties,
          },
          scheduledFor: scheduleDate || null,
        },
      });

      if (error) throw error;
      Alert.alert('Success', scheduleDate ? 'Message scheduled!' : 'Message sent!');
      onSent();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Send Bulk Message</Text>
      
      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Message subject"
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        placeholder="Your message..."
        multiline
        numberOfLines={6}
      />

      <Text style={styles.label}>Recipients</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[styles.filterBtn, filterType === 'all' && styles.filterBtnActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={styles.filterBtnText}>All Tenants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filterType === 'properties' && styles.filterBtnActive]}
          onPress={() => setFilterType('properties')}
        >
          <Text style={styles.filterBtnText}>By Property</Text>
        </TouchableOpacity>
      </View>

      {filterType === 'properties' && (
        <View style={styles.propertyList}>
          {properties.map(prop => (
            <TouchableOpacity
              key={prop.id}
              style={[styles.propertyItem, selectedProperties.includes(prop.id) && styles.propertyItemSelected]}
              onPress={() => toggleProperty(prop.id)}
            >
              <Text style={styles.propertyTitle}>{prop.title}</Text>
              <Text style={styles.propertyAddress}>{prop.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.recipientCount}>Recipients: {recipientCount}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={styles.sendBtnText}>{loading ? 'Sending...' : 'Send Now'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  filterButtons: { flexDirection: 'row', gap: 10 },
  filterBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterBtnText: { fontSize: 14, fontWeight: '600' },
  propertyList: { marginTop: 10 },
  propertyItem: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 },
  propertyItemSelected: { backgroundColor: '#E3F2FD', borderColor: '#007AFF' },
  propertyTitle: { fontSize: 16, fontWeight: '600' },
  propertyAddress: { fontSize: 14, color: '#666', marginTop: 4 },
  recipientCount: { fontSize: 16, fontWeight: '600', marginTop: 20, color: '#007AFF' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 30, marginBottom: 40 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: '#666' },
  sendBtn: { flex: 1, padding: 16, borderRadius: 8, backgroundColor: '#007AFF', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
