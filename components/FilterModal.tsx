import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { PriceRangeSlider } from './PriceRangeSlider';
import { LocationPicker } from './LocationPicker';
import { AmenitiesCheckboxes } from './AmenitiesCheckboxes';
import { FilterPresets } from './FilterPresets';
import { SavedSearches } from './SavedSearches';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export const FilterModal = ({ visible, onClose, onApply, initialFilters }: Props) => {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000);
  const [rooms, setRooms] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [maxSize, setMaxSize] = useState(200);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(10);
  const [balcony, setBalcony] = useState(false);
  const [parking, setParking] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);

  useEffect(() => {
    if (initialFilters) loadPreset(initialFilters);
  }, [initialFilters]);


  const handleToggleAmenity = (key: string) => {
    const setters: any = { balcony: setBalcony, parking: setParking, elevator: setElevator, furnished: setFurnished, petsAllowed: setPetsAllowed };
    const values: any = { balcony, parking, elevator, furnished, petsAllowed };
    setters[key](!values[key]);
  };

  const handleApply = () => {
    onApply({ priceMin, priceMax, rooms, minSize, maxSize, location, radius, balcony, parking, elevator, furnished, petsAllowed });
    onClose();
  };

  const handleReset = () => {
    setPriceMin(0);
    setPriceMax(5000);
    setRooms(0);
    setMinSize(0);
    setMaxSize(200);
    setLocation('');
    setRadius(10);
    setBalcony(false);
    setParking(false);
    setElevator(false);
    setFurnished(false);
    setPetsAllowed(false);
  };

  const loadPreset = (filters: any) => {
    setPriceMin(filters.priceMin || 0);
    setPriceMax(filters.priceMax || 5000);
    setRooms(filters.rooms || 0);
    setMinSize(filters.minSize || 0);
    setMaxSize(filters.maxSize || 200);
    setLocation(filters.location || '');
    setRadius(filters.radius || 10);
    setBalcony(filters.balcony || false);
    setParking(filters.parking || false);
    setElevator(filters.elevator || false);
    setFurnished(filters.furnished || false);
    setPetsAllowed(filters.petsAllowed || false);
  };


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Advanced Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <SavedSearches currentFilters={{ priceMin, priceMax, rooms, minSize, maxSize, location, radius, balcony, parking, elevator, furnished, petsAllowed }} onLoadSearch={loadPreset} />
            <PriceRangeSlider minValue={priceMin} maxValue={priceMax} onMinChange={setPriceMin} onMaxChange={setPriceMax} />
            <Text style={styles.label}>Size (m²)</Text>
            <View style={styles.sizeInputs}>
              <TextInput style={styles.sizeInput} placeholder="Min" keyboardType="numeric" value={minSize.toString()} onChangeText={(v) => setMinSize(parseInt(v) || 0)} />
              <Text style={styles.sizeSeparator}>-</Text>
              <TextInput style={styles.sizeInput} placeholder="Max" keyboardType="numeric" value={maxSize.toString()} onChangeText={(v) => setMaxSize(parseInt(v) || 200)} />
            </View>
            <LocationPicker location={location} radius={radius} onLocationChange={setLocation} onRadiusChange={setRadius} />
            <Text style={styles.label}>Minimum Rooms</Text>
            <View style={styles.roomButtons}>
              {[0, 1, 2, 3, 4].map(num => (
                <TouchableOpacity key={num} style={[styles.roomBtn, rooms === num && styles.roomBtnActive]} onPress={() => setRooms(num)}>
                  <Text style={[styles.roomText, rooms === num && styles.roomTextActive]}>{num === 0 ? 'Any' : num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <AmenitiesCheckboxes balcony={balcony} parking={parking} elevator={elevator} furnished={furnished} petsAllowed={petsAllowed} onToggle={handleToggleAmenity} />

          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  content: { padding: Spacing.lg },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm, marginTop: Spacing.md },
  sizeInputs: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  sizeInput: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md, borderRadius: 8, fontSize: 16 },
  sizeSeparator: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginHorizontal: Spacing.sm },
  roomButtons: { flexDirection: 'row', marginBottom: Spacing.lg },
  roomBtn: { flex: 1, paddingVertical: 12, backgroundColor: Colors.background, marginRight: Spacing.xs, borderRadius: 8, alignItems: 'center' },
  roomBtnActive: { backgroundColor: Colors.primary },
  roomText: { fontSize: 16, color: Colors.text },
  roomTextActive: { color: Colors.card, fontWeight: 'bold' },
  footer: { flexDirection: 'row', padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border },
  resetBtn: { flex: 1, paddingVertical: 14, backgroundColor: Colors.background, borderRadius: 8, alignItems: 'center', marginRight: Spacing.sm },
  resetText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  applyBtn: { flex: 2, paddingVertical: 14, backgroundColor: Colors.primary, borderRadius: 8, alignItems: 'center' },
  applyText: { fontSize: 16, fontWeight: 'bold', color: Colors.card },
});


