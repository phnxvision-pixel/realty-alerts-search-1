import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface FilterPreset {
  id: string;
  name: string;
  filters: any;
}

interface Props {
  currentFilters: any;
  onLoadPreset: (filters: any) => void;
}

export const FilterPresets = ({ currentFilters, onLoadPreset }: Props) => {
  const { user } = useAuth();
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const stored = await AsyncStorage.getItem('filterPresets');
      if (stored) setPresets(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading presets:', error);
    }
  };

  const savePreset = async () => {
    if (!presetName.trim()) return;
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName,
      filters: currentFilters,
    };
    const updated = [...presets, newPreset];
    await AsyncStorage.setItem('filterPresets', JSON.stringify(updated));
    setPresets(updated);
    setPresetName('');
    setShowSave(false);
    
    // Sync with database for notifications
    if (user?.id) {
      await supabase.from('filter_notifications').insert({
        user_id: user.id,
        filter_name: presetName,
        filter_data: currentFilters,
        notifications_enabled: false
      });
    }
    
    
    Alert.alert('Success', 'Filter preset saved!');
  };

  const deletePreset = async (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    await AsyncStorage.setItem('filterPresets', JSON.stringify(updated));
    setPresets(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Saved Presets</Text>
        <TouchableOpacity onPress={() => setShowSave(!showSave)}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      {showSave && (
        <View style={styles.saveRow}>
          <TextInput
            style={styles.input}
            placeholder="Preset name"
            value={presetName}
            onChangeText={setPresetName}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={savePreset}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      {presets.map(preset => (
        <View key={preset.id} style={styles.presetRow}>
          <TouchableOpacity style={styles.presetBtn} onPress={() => onLoadPreset(preset.filters)}>
            <Ionicons name="bookmark" size={18} color={Colors.primary} />
            <Text style={styles.presetText}>{preset.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePreset(preset.id)}>
            <Ionicons name="trash-outline" size={18} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text },
  saveRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  input: { flex: 1, backgroundColor: Colors.background, borderRadius: 8, paddingHorizontal: Spacing.md, paddingVertical: 8, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  saveBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: 8, justifyContent: 'center' },
  saveBtnText: { color: Colors.card, fontWeight: '600' },
  presetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  presetBtn: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  presetText: { fontSize: 14, color: Colors.text, marginLeft: Spacing.sm },
});
