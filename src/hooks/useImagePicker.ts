import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images!'
      );
      return false;
    }
    return true;
  };

  const pickImage = async (): Promise<string | null> => {
    try {
      setLoading(true);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10], // Good aspect ratio for card banners
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      setLoading(true);
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take photos!'
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const showImagePickerOptions = (): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose how you want to add an image',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
          { 
            text: 'Camera', 
            onPress: async () => {
              const uri = await takePhoto();
              resolve(uri);
            }
          },
          { 
            text: 'Gallery', 
            onPress: async () => {
              const uri = await pickImage();
              resolve(uri);
            }
          },
        ]
      );
    });
  };

  return {
    loading,
    pickImage,
    takePhoto,
    showImagePickerOptions,
  };
};