import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { Colors } from '@/constants/theme';

interface ReviewFormProps {
  apartmentId: string;
  landlordId?: string;
  onSubmit: () => void;
}

export default function ReviewForm({ apartmentId, landlordId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [location, setLocation] = useState(5);
  const [value, setValue] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !comment.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('reviews').insert({
        apartment_id: apartmentId,
        landlord_id: landlordId,
        user_id: user.id,
        rating,
        title,
        comment,
        cleanliness_rating: cleanliness,
        communication_rating: communication,
        location_rating: location,
        value_rating: value
      });

      if (error) throw error;
      Alert.alert('Success', 'Review submitted!');
      onSubmit();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const RatingSelector = ({ value, onChange, label }: any) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.stars}>
        {[1,2,3,4,5].map(star => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Text style={styles.star}>{star <= value ? '★' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Write a Review</Text>
      <RatingSelector value={rating} onChange={setRating} label="Overall" />
      <RatingSelector value={cleanliness} onChange={setCleanliness} label="Cleanliness" />
      <RatingSelector value={communication} onChange={setCommunication} label="Communication" />
      <RatingSelector value={location} onChange={setLocation} label="Location" />
      <RatingSelector value={value} onChange={setValue} label="Value" />
      <TextInput style={styles.input} placeholder="Review Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.textArea} placeholder="Your Review" value={comment} onChangeText={setComment} multiline numberOfLines={4} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  ratingLabel: { fontSize: 14, fontWeight: '500' },
  stars: { flexDirection: 'row' },
  star: { fontSize: 24, marginHorizontal: 4, color: Colors.primary },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  textArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
