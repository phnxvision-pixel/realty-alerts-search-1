import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_APARTMENTS } from '@/constants/apartments';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { PaywallModal } from '@/app/components/PaywallModal';
import DocumentUploader from '@/components/DocumentUploader';
import RentalApplicationForm from '@/components/RentalApplicationForm';
import NeighborhoodInfo from '@/components/NeighborhoodInfo';
import ReviewsList from '@/components/ReviewsList';
import ReviewForm from '@/components/ReviewForm';
import VirtualTourViewer from '@/components/VirtualTourViewer';
import PriceAnalytics from '@/components/PriceAnalytics';
import MatchExplanation from '@/components/MatchExplanation';
import MatchScoreBadge from '@/components/MatchScoreBadge';
import { supabase } from '@/app/lib/supabase';



export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { favorites, toggleFavorite, showPaywallModal, setShowPaywallModal } = useApp();
  const { user } = useAuth();
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [virtualTours, setVirtualTours] = useState([]);
  const apartment = ALL_APARTMENTS.find(apt => apt.id === id);



  if (!apartment) {
    return (
      <View style={styles.error}>
        <Text>Apartment not found</Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(apartment.id);

  const handleContactLandlord = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', apartment.id)
        .eq('tenant_id', user.id)
        .single();

      if (existing) {
        router.push(`/messages/${existing.id}`);
      } else {
        // Create new conversation
        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert({
            listing_id: apartment.id,
            tenant_id: user.id,
            landlord_id: apartment.landlord_id
          })
          .select()
          .single();

        if (error) throw error;
        router.push(`/messages/${newConv.id}`);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: apartment.image }} style={styles.mainImage} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{apartment.title}</Text>
            <Text style={styles.location}>{apartment.location}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavorite(apartment.id)}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={32}
              color={isFavorite ? Colors.secondary : Colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>€{apartment.price}/month</Text>
          {apartment.isNew && <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>}
        </View>
        <View style={styles.specs}>
          <View style={styles.spec}>
            <Ionicons name="bed" size={24} color={Colors.primary} />
            <Text style={styles.specText}>{apartment.rooms} rooms</Text>
          </View>
          <View style={styles.spec}>
            <Ionicons name="resize" size={24} color={Colors.primary} />
            <Text style={styles.specText}>{apartment.size}m²</Text>
          </View>
          <View style={styles.spec}>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            <Text style={styles.specText}>{apartment.availableFrom}</Text>
          </View>
        </View>
        <View style={styles.features}>
          {apartment.petsAllowed && (
            <View style={styles.featureChip}><Text>Pets Allowed</Text></View>
          )}
          {apartment.furnished && (
            <View style={styles.featureChip}><Text>Furnished</Text></View>
          )}
          {apartment.balcony && (
            <View style={styles.featureChip}><Text>Balcony</Text></View>
          )}
        </View>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{apartment.description}</Text>
        <Text style={styles.source}>Source: {apartment.source}</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContactLandlord}>
          <Text style={styles.contactText}>Contact Landlord</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.applicationBtn} 
          onPress={() => setShowApplicationForm(true)}
        >
          <Ionicons name="document-text" size={20} color="white" />
          <Text style={styles.applicationText}>Submit Rental Application</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.uploadBtn} 
          onPress={() => setShowDocUpload(true)}
        >
          <Ionicons name="document-attach" size={20} color={Colors.primary} />
          <Text style={styles.uploadText}>Upload Application Documents</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        
        <VirtualTourViewer tours={virtualTours} />
        
        <View style={styles.divider} />
        
        <PriceAnalytics 
          apartmentId={apartment.id}
          currentPrice={parseFloat(apartment.price)}
          location={apartment.location}
          rooms={apartment.rooms}
        />
        
        <View style={styles.divider} />
        
        <NeighborhoodInfo 
          latitude={apartment.latitude || 52.52}
          longitude={apartment.longitude || 13.405}
          location={apartment.location}
        />
        
        <View style={styles.divider} />
        
        <ReviewsList apartmentId={apartment.id} />
        
        <TouchableOpacity 
          style={styles.reviewBtn} 
          onPress={() => setShowReviewForm(true)}
        >
          <Ionicons name="star" size={20} color="white" />
          <Text style={styles.reviewBtnText}>Write a Review</Text>
        </TouchableOpacity>

      </View>


      <Modal
        visible={showApplicationForm}
        animationType="slide"
        onRequestClose={() => setShowApplicationForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rental Application</Text>
            <TouchableOpacity onPress={() => setShowApplicationForm(false)}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <RentalApplicationForm
            apartmentId={apartment.id}
            landlordId={apartment.landlord_id || 'default-landlord'}
            onSuccess={() => {
              setShowApplicationForm(false);
              router.push('/applications/my-applications');
            }}
            onCancel={() => setShowApplicationForm(false)}
          />
        </View>
      </Modal>


      <Modal
        visible={showDocUpload}
        animationType="slide"
        onRequestClose={() => setShowDocUpload(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Documents</Text>
            <TouchableOpacity onPress={() => setShowDocUpload(false)}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <DocumentUploader conversationId={conversationId} />
        </View>
      </Modal>


      <Modal
        visible={showReviewForm}
        animationType="slide"
        onRequestClose={() => setShowReviewForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <TouchableOpacity onPress={() => setShowReviewForm(false)}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <ReviewForm
              apartmentId={apartment.id}
              landlordId={apartment.landlord_id}
              onSubmit={() => setShowReviewForm(false)}
            />
          </ScrollView>
        </View>
      </Modal>

      <PaywallModal 
        visible={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        feature="unlimited favorites"
      />
    </ScrollView>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 300 },
  content: { padding: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  headerLeft: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  location: { fontSize: 16, color: Colors.textLight, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  price: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginRight: Spacing.md },
  newBadge: { backgroundColor: Colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  newText: { color: Colors.card, fontSize: 12, fontWeight: 'bold' },
  specs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.lg, backgroundColor: Colors.card, padding: Spacing.md, borderRadius: 8 },
  spec: { alignItems: 'center' },
  specText: { fontSize: 14, color: Colors.text, marginTop: 4 },
  features: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.lg },
  featureChip: { backgroundColor: Colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.sm },
  description: { fontSize: 16, color: Colors.text, lineHeight: 24, marginBottom: Spacing.lg },
  source: { fontSize: 14, color: Colors.textLight, marginBottom: Spacing.lg },
  contactBtn: { backgroundColor: Colors.secondary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  contactText: { color: Colors.card, fontSize: 16, fontWeight: 'bold' },
  applicationBtn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  applicationText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  uploadBtn: { backgroundColor: Colors.card, padding: 16, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary },
  uploadText: { color: Colors.primary, fontSize: 16, fontWeight: '600', marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  reviewBtn: { backgroundColor: Colors.secondary, padding: 16, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  reviewBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' }
});


