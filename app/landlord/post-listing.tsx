import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLandlord } from '@/contexts/LandlordContext';
import { supabase } from '@/app/lib/supabase';

export default function PostListing() {
  const router = useRouter();
  const { landlordProfile } = useLandlord();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !address || !city || !price) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('landlord_listings')
        .insert([{
          landlord_id: landlordProfile?.id,
          title,
          description,
          address,
          city,
          price: parseFloat(price),
          bedrooms: parseInt(bedrooms) || 1,
          bathrooms: parseFloat(bathrooms) || 1,
          status: 'active'
        }]);

      if (error) throw error;
      Alert.alert('Success', 'Listing posted successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.input} placeholder="Title *" value={title} onChangeText={setTitle} />
      <TextInput style={styles.textArea} placeholder="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} />
      <TextInput style={styles.input} placeholder="Address *" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="City *" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Price *" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Bedrooms" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Bathrooms" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" />

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Post Listing'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  textArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, height: 100 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, marginTop: 20 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }
});
