import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const slides = [
  { 
    id: '1', 
    title: 'Willkommen bei WohnAgent', 
    description: 'Deine intelligente Plattform für die perfekte Wohnung. Wir revolutionieren die Wohnungssuche in Deutschland.', 
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762233830076_371b25f4.webp'
  },
  { 
    id: '2', 
    title: 'KI-Powered Suche', 
    description: 'Unser fortschrittlicher KI-Agent durchsucht kontinuierlich tausende Quellen und findet genau die Wohnungen, die zu dir passen.', 
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762233830857_f7773796.webp'
  },
  { 
    id: '3', 
    title: 'Sei der Erste', 
    description: 'Erhalte Benachrichtigungen zu neuen Angeboten in Echtzeit – oft Minuten bevor sie auf anderen Plattformen erscheinen.', 
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762233831612_56d13304.webp'
  },
  { 
    id: '4', 
    title: 'Jetzt loslegen!', 
    description: 'Erstelle dein kostenloses Profil und lass unseren digitalen Wohnungsdetektiv für dich arbeiten. Deine Traumwohnung wartet!', 
    image: 'https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762233832431_5a6bce8b.webp'
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/auth/signup');
    }
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Überspringen</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? 'Jetzt starten' : 'Weiter'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  skipButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  skipText: { color: '#007AFF', fontSize: 16 },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 40, paddingTop: 100 },
  image: { width: width * 0.8, height: 200, borderRadius: 16, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  description: { fontSize: 16, color: '#666', marginTop: 16, textAlign: 'center', paddingHorizontal: 20 },
  footer: { padding: 20, paddingBottom: 40 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#007AFF', width: 24 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
