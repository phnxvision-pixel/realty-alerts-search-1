import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ALL_APARTMENTS } from '@/constants/apartments';
import { ApartmentCard } from '@/components/ApartmentCard';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PaywallModal } from '@/app/components/PaywallModal';

export default function FavoritesScreen() {
  const { favorites, getRemainingFavorites, showPaywallModal, setShowPaywallModal } = useApp();
  const { isPremium } = useAuth();
  const { t } = useLocalization();
  const router = useRouter();

  const favoriteApartments = ALL_APARTMENTS.filter(apt => favorites.includes(apt.id));
  const remaining = getRemainingFavorites();

  return (
    <View style={styles.container}>
      {!isPremium && (
        <View style={styles.limitBanner}>
          <View style={styles.limitHeader}>
            <Ionicons name="heart" size={20} color={Colors.primary} />
            <Text style={styles.limitTitle}>
              {t('favorites.limitUsed')}: {favorites.length}/5
            </Text>
          </View>
          <Text style={styles.limitSubtext}>
            {remaining > 0 
              ? `${remaining} ${t('favorites.remaining')}`
              : t('favorites.upgrade')}
          </Text>
          <TouchableOpacity 
            style={styles.upgradeBtn}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.upgradeBtnText}>{t('favorites.upgradeBtn')}</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.card} />
          </TouchableOpacity>
        </View>
      )}
      
      {favoriteApartments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={Colors.textLight} />
          <Text style={styles.emptyText}>{t('favorites.empty')}</Text>
          <Text style={styles.emptySubtext}>
            {t('favorites.emptyDesc')}
          </Text>
        </View>


      ) : (
        <FlatList
          data={favoriteApartments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ApartmentCard apartment={item} />}
          contentContainerStyle={styles.list}
        />
      )}

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
  list: { padding: Spacing.md },
  limitBanner: { 
    backgroundColor: Colors.premium, 
    padding: Spacing.md, 
    margin: Spacing.md, 
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary + '30'
  },
  limitHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: Spacing.xs 
  },
  limitTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.text,
    marginLeft: Spacing.xs
  },
  limitSubtext: { 
    fontSize: 14, 
    color: Colors.textLight,
    marginBottom: Spacing.sm
  },
  upgradeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs
  },
  upgradeBtnText: {
    color: Colors.card,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: Spacing.xs
  },
  empty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: Spacing.xl 
  },
  emptyText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginTop: Spacing.md,
    marginBottom: Spacing.sm 
  },
  emptySubtext: { 
    fontSize: 16, 
    color: Colors.textLight, 
    textAlign: 'center',
    marginBottom: Spacing.sm
  },
  emptyLimit: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.sm
  }
});

