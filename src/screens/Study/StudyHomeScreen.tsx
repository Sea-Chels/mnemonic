import React, { useState } from 'react';
import { View } from 'react-native';
import { Layout, Text, Card, Button } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDecks } from '../../hooks/decks/useDecks';

export const StudyHomeScreen: React.FC = () => {
  const { decks } = useDecks();
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Mock flashcard data for demo
  const currentCard = {
    front: 'What is React Native?',
    back: 'A framework for building native mobile apps using React'
  };

  if (isStudying) {
    return (
      <Layout style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Card style={{ minHeight: 300, justifyContent: 'center', alignItems: 'center' }}>
          <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
            {showAnswer ? currentCard.back : currentCard.front}
          </Text>
        </Card>
        
        <View style={{ marginTop: 24, gap: 12 }}>
          {!showAnswer ? (
            <Button onPress={() => setShowAnswer(true)}>
              Show Answer
            </Button>
          ) : (
            <>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button 
                  status="danger" 
                  style={{ flex: 1 }}
                  onPress={() => {
                    setShowAnswer(false);
                    // Handle difficult card
                  }}
                >
                  Hard
                </Button>
                <Button 
                  status="warning" 
                  style={{ flex: 1 }}
                  onPress={() => {
                    setShowAnswer(false);
                    // Handle medium card
                  }}
                >
                  Good
                </Button>
                <Button 
                  status="success" 
                  style={{ flex: 1 }}
                  onPress={() => {
                    setShowAnswer(false);
                    // Handle easy card
                  }}
                >
                  Easy
                </Button>
              </View>
              <Button 
                appearance="ghost"
                onPress={() => setShowAnswer(false)}
              >
                Hide Answer
              </Button>
            </>
          )}
          
          <Button 
            appearance="outline"
            onPress={() => {
              setIsStudying(false);
              setShowAnswer(false);
            }}
          >
            End Session
          </Button>
        </View>
      </Layout>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Text category="h1" style={{ marginBottom: 24 }}>Study</Text>
      
      {decks.length === 0 ? (
        <Card>
          <Text category="h6" appearance="hint" style={{ textAlign: 'center' }}>
            No decks available
          </Text>
          <Text appearance="hint" style={{ textAlign: 'center', marginTop: 8 }}>
            Create a deck first to start studying
          </Text>
        </Card>
      ) : (
        <>
          <Text category="h6" style={{ marginBottom: 12 }}>Select a deck to study:</Text>
          {decks.map((deck) => (
            <Card 
              key={deck.id}
              style={{ marginBottom: 12 }}
              onPress={() => setSelectedDeck(deck.id)}
              status={selectedDeck === deck.id ? 'primary' : 'basic'}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text category="s1">{deck.name}</Text>
                <View 
                  style={{ 
                    backgroundColor: deck.color, 
                    width: 30, 
                    height: 30, 
                    borderRadius: 15 
                  }} 
                />
              </View>
              {deck.description && (
                <Text appearance="hint" category="c1" style={{ marginTop: 4 }}>
                  {deck.description}
                </Text>
              )}
            </Card>
          ))}
          
          <Button 
            style={{ marginTop: 24 }}
            disabled={!selectedDeck}
            onPress={() => setIsStudying(true)}
          >
            Start Studying
          </Button>
        </>
      )}
      </Layout>
    </SafeAreaView>
  );
};