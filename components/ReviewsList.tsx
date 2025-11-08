import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { Colors } from '@/constants/theme';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  cleanliness_rating: number;
  communication_rating: number;
  location_rating: number;
  value_rating: number;
  created_at: string;
  users: { full_name: string };
}

interface ReviewsListProps {
  apartmentId: string;
}

export default function ReviewsList({ apartmentId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [apartmentId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, users(full_name)')
        .eq('apartment_id', apartmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAvgRating(avg);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.header}>
        <Text style={styles.userName}>{item.users?.full_name || 'Anonymous'}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.stars}>{renderStars(item.rating)}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.comment}>{item.comment}</Text>
      <View style={styles.subRatings}>
        <Text style={styles.subRating}>Clean: {item.cleanliness_rating}/5</Text>
        <Text style={styles.subRating}>Location: {item.location_rating}/5</Text>
        <Text style={styles.subRating}>Value: {item.value_rating}/5</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={Colors.primary} />;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.avgRating}>{avgRating.toFixed(1)}</Text>
        <Text style={styles.avgStars}>{renderStars(avgRating)}</Text>
        <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
      </View>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No reviews yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  summary: { alignItems: 'center', marginBottom: 20, padding: 16, backgroundColor: '#f8f8f8', borderRadius: 8 },
  avgRating: { fontSize: 48, fontWeight: 'bold', color: Colors.primary },
  avgStars: { fontSize: 24, color: Colors.primary, marginVertical: 8 },
  reviewCount: { fontSize: 14, color: '#666' },
  reviewCard: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 12, color: '#666' },
  stars: { fontSize: 18, color: Colors.primary, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  comment: { fontSize: 14, color: '#333', marginBottom: 12 },
  subRatings: { flexDirection: 'row', justifyContent: 'space-between' },
  subRating: { fontSize: 12, color: '#666' },
  empty: { textAlign: 'center', color: '#666', marginTop: 20 }
});
