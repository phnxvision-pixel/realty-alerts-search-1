import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { ApartmentCard } from '@/components/ApartmentCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { FilterModal } from '@/components/FilterModal';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { PaywallModal } from '@/app/components/PaywallModal';
import ProfileCompletionBanner from '@/components/ProfileCompletionBanner';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import { OAuthProfileBanner } from '@/components/OAuthProfileBanner';



export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [apartments, setApartments] = useState([]);
  const [matchScores, setMatchScores] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [useAIMatching, setUseAIMatching] = useState(false);
  const [calculatingMatches, setCalculatingMatches] = useState(false);
  const { compareList, showPaywallModal, setShowPaywallModal } = useApp();
  const { isPremium, user } = useAuth();
  const router = useRouter();



  useEffect(() => {
    fetchApartments();
    loadMatchScores();
  }, []);

  const fetchApartments = async () => {
    setLoading(true);
    const { data } = await supabase.from('apartments').select('*').order('created_at', { ascending: false });
    setApartments(data || []);
    setLoading(false);
  };

  const loadMatchScores = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('apartment_match_scores')
      .select('*')
      .eq('user_id', user.id);
    
    if (data) {
      const scores: Record<string, any> = {};
      data.forEach(item => {
        scores[item.apartment_id] = item;
      });
      setMatchScores(scores);
    }
  };

  const calculateMatches = async () => {
    if (!user || calculatingMatches) return;
    setCalculatingMatches(true);

    const apartmentIds = filteredApartments.map(apt => apt.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-apartment-matches', {
        body: { userId: user.id, apartmentIds },
      });

      if (!error && data?.matches) {
        const scores: Record<string, any> = {};
        data.matches.forEach((match: any) => {
          scores[match.apartmentId] = match;
        });
        setMatchScores(scores);
        setUseAIMatching(true);
      }
    } catch (err) {
      console.error('Match calculation error:', err);
    }
    
    setCalculatingMatches(false);
  };

  const filteredApartments = apartments.filter(apt => {
    const matchesSearch = apt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = 
      (!filters.priceMin || apt.price >= filters.priceMin) &&
      (!filters.priceMax || apt.price <= filters.priceMax);
    
    const matchesRooms = !filters.rooms || apt.rooms >= filters.rooms;

    const matchesSize = 
      (!filters.minSize || apt.size >= filters.minSize) &&
      (!filters.maxSize || apt.size <= filters.maxSize);
    
    const matchesLocation = !filters.location || 
      apt.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      apt.address?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesAmenities = 
      (!filters.balcony || apt.balcony) &&
      (!filters.parking || apt.parking) &&
      (!filters.elevator || apt.elevator) &&
      (!filters.furnished || apt.furnished) &&
      (!filters.petsAllowed || apt.pets_allowed);
    
    return matchesSearch && matchesPrice && matchesRooms && matchesSize && matchesLocation && matchesAmenities;
  });

  const sortedApartments = useAIMatching 
    ? [...filteredApartments].sort((a, b) => {
        const scoreA = matchScores[a.id]?.matchScore || 0;
        const scoreB = matchScores[b.id]?.matchScore || 0;
        return scoreB - scoreA;
      })
    : filteredApartments;

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 0 && v !== '').length;

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };



  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762069477017_73cd0a0d.webp' }}
        style={styles.hero}
      />
      <View style={styles.heroOverlay}>
        <Text style={styles.heroTitle}>Find Your Perfect Home</Text>
        <Text style={styles.heroSubtitle}>{apartments.length}+ apartments available</Text>
      </View>
      
      <OAuthProfileBanner />
      <EmailVerificationBanner />
      <ProfileCompletionBanner />


      
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FilterBar onFilterPress={() => setShowFilters(!showFilters)} activeFilters={activeFilterCount} />


      {user && (
        <View style={styles.aiMatchBar}>
          <View style={styles.aiMatchContent}>
            <Text style={styles.aiMatchText}>AI Smart Matching</Text>
            <Switch value={useAIMatching} onValueChange={setUseAIMatching} />
          </View>
          <TouchableOpacity 
            style={[styles.calculateBtn, calculatingMatches && styles.calculateBtnDisabled]}
            onPress={calculateMatches}
            disabled={calculatingMatches}
          >
            <Text style={styles.calculateBtnText}>
              {calculatingMatches ? 'Calculating...' : 'Update Matches'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.premiumBanner} onPress={() => router.push('/settings')}>
          <Text style={styles.premiumText}>Upgrade to Premium for instant alerts!</Text>
        </TouchableOpacity>
      )}
      {compareList.length > 0 && (
        <TouchableOpacity style={styles.compareBar} onPress={() => router.push('/compare')}>
          <Text style={styles.compareText}>Compare {compareList.length} apartments</Text>
        </TouchableOpacity>
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />
      <FlatList
        data={sortedApartments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ApartmentCard 
            apartment={item} 
            matchScore={matchScores[item.id]?.matchScore}
            showMatchScore={useAIMatching}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <PaywallModal 
        visible={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        feature="unlimited favorites"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { width: '100%', height: 200 },
  heroOverlay: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center', zIndex: 1 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.card, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  heroSubtitle: { fontSize: 16, color: Colors.card, marginTop: 8 },
  list: { padding: Spacing.md },
  aiMatchBar: { backgroundColor: '#f0f9ff', padding: Spacing.md, marginHorizontal: Spacing.md, borderRadius: 8, marginBottom: Spacing.sm, borderWidth: 1, borderColor: '#3b82f6' },
  aiMatchContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  aiMatchText: { fontSize: 16, fontWeight: '600', color: '#1e40af' },
  calculateBtn: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 6, alignItems: 'center' },
  calculateBtnDisabled: { opacity: 0.6 },
  calculateBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  premiumBanner: { backgroundColor: Colors.premium, padding: Spacing.md, marginHorizontal: Spacing.md, borderRadius: 8, marginBottom: Spacing.sm },
  premiumText: { textAlign: 'center', fontWeight: 'bold', color: Colors.primary },
  compareBar: { backgroundColor: Colors.secondary, padding: Spacing.md, marginHorizontal: Spacing.md, borderRadius: 8, marginBottom: Spacing.sm },
  compareText: { textAlign: 'center', fontWeight: 'bold', color: Colors.card },
});
