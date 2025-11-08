import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerButtonProps {
  onImagesSelected: (uris: string[]) => void;
}

export default function ImagePickerButton({ onImagesSelected }: ImagePickerButtonProps) {
  
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to share images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      onImagesSelected(uris);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      onImagesSelected([result.assets[0].uri]);
    }
  };

  const handlePress = () => {
    Alert.alert(
      'Share Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImages },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ padding: 8 }}>
      <Ionicons name="image" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
}
