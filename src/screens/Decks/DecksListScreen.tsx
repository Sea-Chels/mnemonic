import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Layout, Text, Card, Button, Input, Modal } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDecks } from '../../hooks/decks/useDecks';
import { Deck } from '../../database/types';

export const DecksListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { decks, loading, error, createDeck, deleteDeck } = useDecks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  const handleCreateDeck = useCallback(async () => {
    if (!newDeckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    try {
      await createDeck(newDeckName.trim(), newDeckDescription.trim());
      setNewDeckName('');
      setNewDeckDescription('');
      setIsModalVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to create deck');
    }
  }, [newDeckName, newDeckDescription, createDeck]);

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
      style={{ marginBottom: 16 }}
      onPress={() => navigation.navigate('DeckDetail', { deckId: item.id })}
      onLongPress={() => handleDeleteDeck(item)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text category="h6">{item.name}</Text>
          {item.description ? (
            <Text appearance="hint" category="c1">{item.description}</Text>
          ) : null}
        </View>
        <View style={{ backgroundColor: item.color, width: 40, height: 40, borderRadius: 20 }} />
      </View>
    </Card>
  ), [navigation, handleDeleteDeck]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Layout style={{ flex: 1, padding: 16 }}>
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

      <Modal
        visible={isModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setIsModalVisible(false)}
        style={{ width: '90%' }}
      >
        <Card disabled={true}>
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
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button 
              appearance="ghost" 
              onPress={() => {
                setIsModalVisible(false);
                setNewDeckName('');
                setNewDeckDescription('');
              }}
            >
              Cancel
            </Button>
            <Button onPress={handleCreateDeck}>
              Create
            </Button>
          </View>
        </Card>
      </Modal>
      </Layout>
    </SafeAreaView>
  );
};