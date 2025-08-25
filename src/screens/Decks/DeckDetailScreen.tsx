import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Layout, Text, Card, Button, Input, Modal, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFlashcards } from '../../hooks/flashcards/useFlashcards';
import { useDecks } from '../../hooks/decks/useDecks';
import { Flashcard, Deck } from '../../database/types';
import { calculateDeckStatistics } from '../../utils/spacedRepetition';

interface DeckDetailScreenProps {
  route: { params: { deckId: number } };
  navigation: any;
}

export const DeckDetailScreen: React.FC<DeckDetailScreenProps> = ({ route, navigation }) => {
  const deckId = route.params?.deckId;
  
  if (!deckId) {
    Alert.alert('Error', 'No deck ID provided');
    navigation.goBack();
    return null;
  }
  const { getDeckById } = useDecks();
  const { flashcards, loading, createFlashcard, deleteFlashcard } = useFlashcards(deckId);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  const loadDeck = async () => {
    try {
      const deckData = await getDeckById(deckId);
      if (!deckData) {
        Alert.alert('Error', 'Deck not found');
        navigation.goBack();
        return;
      }
      setDeck(deckData);
    } catch (err) {
      Alert.alert('Error', 'Failed to load deck');
      navigation.goBack();
    }
  };

  const handleCreateCard = async () => {
    if (!newCardFront.trim() || !newCardBack.trim()) {
      Alert.alert('Error', 'Please fill in both sides of the card');
      return;
    }

    try {
      await createFlashcard(deckId, newCardFront.trim(), newCardBack.trim());
      setNewCardFront('');
      setNewCardBack('');
      setIsModalVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to create flashcard');
    }
  };

  const handleDeleteCard = (card: Flashcard) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFlashcard(card.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete card');
            }
          }
        }
      ]
    );
  };

  const stats = calculateDeckStatistics(flashcards);

  const BackIcon = (props: any) => (
    <Ionicons name="arrow-back" size={24} color={props.tintColor || '#8F9BB3'} />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );

  const renderCard = ({ item }: { item: Flashcard }) => (
    <Card
      style={{ marginBottom: 12 }}
      onLongPress={() => handleDeleteCard(item)}
    >
      <View>
        <Text category="s2" style={{ marginBottom: 8 }}>Front:</Text>
        <Text>{item.front}</Text>
        <Text category="s2" style={{ marginTop: 12, marginBottom: 8 }}>Back:</Text>
        <Text>{item.back}</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Text appearance="hint" category="c1">
            Reviews: {item.repetitions} | Interval: {item.interval} days
          </Text>
        </View>
      </View>
    </Card>
  );

  if (!deck) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading deck...</Text>
      </Layout>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title={deck?.name || 'Deck'}
          accessoryLeft={BackAction}
        />
        
        <Layout style={{ padding: 16, flex: 1 }}>
        {/* Statistics Card */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text category="h6">{stats.totalCards}</Text>
              <Text appearance="hint" category="c1">Total</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text category="h6" status="primary">{stats.dueCards}</Text>
              <Text appearance="hint" category="c1">Due</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text category="h6" status="success">{stats.newCards}</Text>
              <Text appearance="hint" category="c1">New</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text category="h6" status="warning">{stats.learningCards}</Text>
              <Text appearance="hint" category="c1">Learning</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <Button
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('StudySession', { deckId })}
            disabled={flashcards.length === 0}
          >
            Study Now
          </Button>
          <Button
            style={{ flex: 1 }}
            appearance="outline"
            onPress={() => setIsModalVisible(true)}
          >
            Add Card
          </Button>
        </View>

        {/* Cards List */}
        {loading ? (
          <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading cards...</Text>
          </Layout>
        ) : flashcards.length === 0 ? (
          <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text category="h6" appearance="hint">No cards yet</Text>
            <Text appearance="hint" style={{ marginTop: 8 }}>Add your first card to start studying</Text>
          </Layout>
        ) : (
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Add Card Modal */}
        <Modal
          visible={isModalVisible}
          backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onBackdropPress={() => setIsModalVisible(false)}
          style={{ width: '90%' }}
        >
          <Card disabled={true}>
            <Text category="h6" style={{ marginBottom: 16 }}>Add New Card</Text>

            <Input
              placeholder="Front (Question)"
              value={newCardFront}
              onChangeText={setNewCardFront}
              multiline
              numberOfLines={3}
              style={{ marginBottom: 12 }}
            />

            <Input
              placeholder="Back (Answer)"
              value={newCardBack}
              onChangeText={setNewCardBack}
              multiline
              numberOfLines={3}
              style={{ marginBottom: 16 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                appearance="ghost"
                onPress={() => {
                  setIsModalVisible(false);
                  setNewCardFront('');
                  setNewCardBack('');
                }}
              >
                Cancel
              </Button>
              <Button onPress={handleCreateCard}>
                Create
              </Button>
            </View>
          </Card>
        </Modal>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};