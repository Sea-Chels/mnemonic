import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, Alert, Image, TouchableOpacity } from 'react-native';
import { Layout, Text, Card, Button, Input, Modal } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDecks } from '../../hooks/decks/useDecks';
import { useImagePicker } from '../../hooks/useImagePicker';
import { Deck } from '../../database/types';
import { EnhancedModal } from '../../ui/components/Enhanced';
import { GradientBackground } from '../../ui/components/Gradient';

export const DecksListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { decks, loading, error, createDeck, deleteDeck } = useDecks();
  const { showImagePickerOptions } = useImagePicker();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newDeckImageUri, setNewDeckImageUri] = useState<string | null>(null);

  const handleCreateDeck = useCallback(async () => {
    if (!newDeckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    try {
      await createDeck(
        newDeckName.trim(), 
        newDeckDescription.trim(), 
        undefined, // color - use default
        newDeckImageUri || undefined
      );
      setNewDeckName('');
      setNewDeckDescription('');
      setNewDeckImageUri(null);
      setIsModalVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to create deck');
    }
  }, [newDeckName, newDeckDescription, newDeckImageUri, createDeck]);

  const handleSelectImage = useCallback(async () => {
    const imageUri = await showImagePickerOptions();
    if (imageUri) {
      setNewDeckImageUri(imageUri);
    }
  }, [showImagePickerOptions]);

  const handleDeleteDeck = useCallback((deck: Deck) => {
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${deck.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDeck(deck.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete deck');
            }
          }
        }
      ]
    );
  }, [deleteDeck]);

  const renderDeck = useCallback(({ item }: { item: Deck }) => (
    <Card 
      style={{ 
        marginBottom: 16,
        overflow: 'hidden',
        minHeight: 100,
      }}
      onPress={() => navigation.navigate('DeckDetail', { deckId: item.id })}
      onLongPress={() => handleDeleteDeck(item)}
    >
      {item.image_uri && (
        <Image 
          source={{ uri: item.image_uri }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
          }}
          resizeMode="cover"
        />
      )}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 16,
        minHeight: 100,
        backgroundColor: item.image_uri ? 'rgba(0,0,0,0.5)' : 'transparent',
      }}>
        <View style={{ flex: 1 }}>
          <Text 
            category="h6" 
            style={{ 
              color: item.image_uri ? 'white' : undefined,
              textShadowColor: item.image_uri ? 'rgba(0,0,0,0.8)' : undefined,
              textShadowOffset: item.image_uri ? { width: 1, height: 1 } : undefined,
              textShadowRadius: item.image_uri ? 3 : undefined,
              marginBottom: 4,
            }}
          >
            {item.name}
          </Text>
          {item.description ? (
            <Text 
              appearance="hint" 
              category="c1"
              style={{
                color: item.image_uri ? 'rgba(255,255,255,0.9)' : undefined,
                textShadowColor: item.image_uri ? 'rgba(0,0,0,0.8)' : undefined,
                textShadowOffset: item.image_uri ? { width: 1, height: 1 } : undefined,
                textShadowRadius: item.image_uri ? 2 : undefined,
              }}
            >
              {item.description}
            </Text>
          ) : null}
        </View>
        <View 
          style={{ 
            backgroundColor: item.color, 
            width: 50, 
            height: 50, 
            borderRadius: 25,
            marginLeft: 12,
            opacity: item.image_uri ? 0.8 : 1,
            borderWidth: item.image_uri ? 2 : 0,
            borderColor: item.image_uri ? 'rgba(255,255,255,0.3)' : 'transparent',
          }} 
        />
      </View>
    </Card>
  ), [navigation, handleDeleteDeck]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <GradientBackground variant="medium">
        <Layout style={{ flex: 1, padding: 16, paddingTop: 60, backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text category="h1">My Decks</Text>
        <Button size="small" onPress={() => setIsModalVisible(true)}>
          Add Deck
        </Button>
      </View>

      {error && (
        <Text status="danger" style={{ marginBottom: 16 }}>{error}</Text>
      )}

      {loading ? (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading decks...</Text>
        </Layout>
      ) : decks.length === 0 ? (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text category="h6" appearance="hint">No decks yet</Text>
          <Text appearance="hint" style={{ marginTop: 8 }}>Create your first deck to get started</Text>
        </Layout>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeck}
          showsVerticalScrollIndicator={false}
        />
      )}

      <EnhancedModal
        visible={isModalVisible}
        onBackdropPress={() => {
          setIsModalVisible(false);
          setNewDeckName('');
          setNewDeckDescription('');
          setNewDeckImageUri(null);
        }}
      >
          <Text category="h6" style={{ marginBottom: 16 }}>Create New Deck</Text>
          
          <Input
            placeholder="Deck Name"
            value={newDeckName}
            onChangeText={setNewDeckName}
            style={{ marginBottom: 12 }}
          />
          
          <Input
            placeholder="Description (optional)"
            value={newDeckDescription}
            onChangeText={setNewDeckDescription}
            multiline
            numberOfLines={3}
            style={{ marginBottom: 16 }}
          />
          
          {/* Image Picker Section */}
          <Text category="s2" style={{ marginBottom: 8 }}>Deck Image (Optional)</Text>
          <TouchableOpacity
            onPress={handleSelectImage}
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: '#8F9BB3',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              minHeight: 100,
            }}
          >
            {newDeckImageUri ? (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: newDeckImageUri }}
                  style={{ width: 80, height: 50, borderRadius: 8, marginBottom: 8 }}
                  resizeMode="cover"
                />
                <Text category="c1" appearance="hint">Tap to change image</Text>
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="camera-outline" size={32} color="#8F9BB3" />
                <Text category="c1" appearance="hint" style={{ marginTop: 8 }}>
                  Tap to add an image
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button 
              appearance="ghost" 
              onPress={() => {
                setIsModalVisible(false);
                setNewDeckName('');
                setNewDeckDescription('');
                setNewDeckImageUri(null);
              }}
            >
              Cancel
            </Button>
            <Button onPress={handleCreateDeck}>
              Create
            </Button>
          </View>
      </EnhancedModal>
        </Layout>
      </GradientBackground>
    </SafeAreaView>
  );
};