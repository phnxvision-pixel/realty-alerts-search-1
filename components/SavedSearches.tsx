import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Modal, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  notify_new_listings: boolean;
  email_frequency: 'instant' | 'daily' | 'weekly' | 'none';
  new_listings_count: number;
}

interface Props {
  currentFilters: any;
  onLoadSearch: (filters: any) => void;
}

export const SavedSearches = ({ currentFilters, onLoadSearch }: Props) => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<SavedSearch | null>(null);
  const [searchName, setSearchName] = useState('');
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState<'instant' | 'daily' | 'weekly' | 'none'>('none');
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadSearches();
  }, [user]);

  const loadSearches = async () => {
    const { data } = await supabase.from('saved_searches').select('*').order('created_at', { ascending: false });
    setSearches(data || []);
  };

  const saveCurrentSearch = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    const { error } = await supabase.from('saved_searches').insert({
      user_id: user?.id,
      name: searchName,
      filters: currentFilters,
      notify_new_listings: notifyEnabled,
      email_frequency: emailFrequency
    });
    if (!error) {
      setShowSaveModal(false);
      setSearchName('');
      loadSearches();
      Alert.alert('Success', 'Search saved!');
    }
  };

  const deleteSearch = async (id: string) => {
    await supabase.from('saved_searches').delete().eq('id', id);
    loadSearches();
  };

  const clearNewCount = async (id: string) => {
    await supabase.from('saved_searches').update({ new_listings_count: 0 }).eq('id', id);
    loadSearches();
  };

  const updateEmailFrequency = async (freq: string) => {
    if (!selectedSearch) return;
    await supabase.from('saved_searches').update({ email_frequency: freq }).eq('id', selectedSearch.id);
    setShowEmailModal(false);
    loadSearches();
  };

  const shareSearch = async (search: SavedSearch) => {
    const params = new URLSearchParams(search.filters).toString();
    const url = `apartmentfinder://search?${params}`;
    try {
      await Share.share({
        message: `Check out this apartment search: ${search.name}`,
        url
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Searches</Text>
        <TouchableOpacity onPress={() => setShowSaveModal(true)} style={styles.saveBtn}>
          <Ionicons name="add" size={20} color={Colors.card} />
          <Text style={styles.saveBtnText}>Save Current</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={searches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity 
              style={styles.itemContent} 
              onPress={() => {
                onLoadSearch(item.filters);
                if (item.new_listings_count > 0) clearNewCount(item.id);
              }}
            >
              <View style={styles.nameRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.new_listings_count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.new_listings_count}</Text>
                  </View>
                )}
              </View>
              {item.email_frequency !== 'none' && (
                <Text style={styles.emailFreq}>Email: {item.email_frequency}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSelectedSearch(item); setShowEmailModal(true); }}>
              <Ionicons name="mail" size={22} color={item.email_frequency !== 'none' ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareSearch(item)}>
              <Ionicons name="share-social" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSearch(item.id)}>
              <Ionicons name="trash" size={22} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Save Search</Text>
            <TextInput style={styles.input} placeholder="Search name" value={searchName} onChangeText={setSearchName} />
            <TouchableOpacity style={styles.notifyToggle} onPress={() => setNotifyEnabled(!notifyEnabled)}>
              <Ionicons name={notifyEnabled ? 'checkbox' : 'square-outline'} size={24} color={Colors.primary} />
              <Text style={styles.notifyText}>Push notifications</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Email Notifications:</Text>
            {['none', 'instant', 'daily', 'weekly'].map(freq => (
              <TouchableOpacity key={freq} style={styles.radioOption} onPress={() => setEmailFrequency(freq as any)}>
                <Ionicons name={emailFrequency === freq ? 'radio-button-on' : 'radio-button-off'} size={24} color={Colors.primary} />
                <Text style={styles.radioText}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSaveModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={saveCurrentSearch}>
                <Text style={styles.confirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showEmailModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Email Notifications</Text>
            <Text style={styles.subtitle}>Choose how often to receive emails:</Text>
            {['none', 'instant', 'daily', 'weekly'].map(freq => (
              <TouchableOpacity key={freq} style={styles.radioOption} onPress={() => updateEmailFrequency(freq)}>
                <Ionicons name={selectedSearch?.email_frequency === freq ? 'radio-button-on' : 'radio-button-off'} size={24} color={Colors.primary} />
                <Text style={styles.radioText}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEmailModal(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  saveBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  saveBtnText: { color: Colors.card, marginLeft: 4, fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.sm, gap: Spacing.sm },
  itemContent: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  itemName: { fontSize: 16, fontWeight: '600', color: Colors.text },
  badge: { backgroundColor: Colors.error, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: Colors.card, fontSize: 12, fontWeight: 'bold' },
  emailFreq: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: Colors.card, borderRadius: 12, padding: Spacing.lg, width: '85%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.md },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.md },
  input: { backgroundColor: Colors.background, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md, fontSize: 16 },
  notifyToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  notifyText: { fontSize: 16, color: Colors.text },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  radioText: { fontSize: 16, color: Colors.text },
  modalButtons: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn: { flex: 1, padding: Spacing.md, backgroundColor: Colors.background, borderRadius: 8, alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  confirmBtn: { flex: 1, padding: Spacing.md, backgroundColor: Colors.primary, borderRadius: 8, alignItems: 'center' },
  confirmText: { fontSize: 16, fontWeight: 'bold', color: Colors.card },
});
