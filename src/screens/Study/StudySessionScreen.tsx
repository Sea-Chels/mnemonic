import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Layout, Text, Card, Button, ProgressBar, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { useSpacedRepetition } from '../../hooks/flashcards/useSpacedRepetition';
import { ReviewQuality } from '../../utils/spacedRepetition';
import { AnimatedFlashcard } from '../../ui/components/Card/AnimatedFlashcard';

interface StudySessionScreenProps {
  route: { params: { deckId: number } };
  navigation: any;
}

export const StudySessionScreen: React.FC<StudySessionScreenProps> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const {
    currentCard,
    sessionStats,
    startStudySession,
    reviewCard,
    endSession,
    isSessionActive,
    remainingCards,
    sessionCards
  } = useSpacedRepetition();
  
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      await startStudySession(deckId);
    } catch (err) {
      Alert.alert('Error', 'Failed to start study session');
      navigation.goBack();
    }
  };

  const handleReview = async (quality: ReviewQuality) => {
    try {
      await reviewCard(quality);
      setShowAnswer(false);
      setIsFlipped(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to review card');
    }
  };

  const handleEndSession = async () => {
    Alert.alert(
      'End Session',
      `You studied ${sessionStats.studied} cards. End session?`,
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'End',
          onPress: async () => {
            await endSession(deckId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const BackIcon = (props: any) => (
    <Icon {...props} name='close' />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={handleEndSession} />
  );

  const progress = sessionCards.length > 0 
    ? sessionStats.studied / sessionCards.length 
    : 0;

  if (!isSessionActive) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text category="h4" style={{ marginBottom: 20 }}>Session Complete!</Text>
        <Card style={{ width: '100%', marginBottom: 20 }}>
          <Text category="h6" style={{ marginBottom: 12 }}>Results</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text category="h4">{sessionStats.studied}</Text>
              <Text appearance="hint">Studied</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text category="h4" status="success">{sessionStats.correct}</Text>
              <Text appearance="hint">Correct</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text category="h4" status="danger">{sessionStats.incorrect}</Text>
              <Text appearance="hint">Incorrect</Text>
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            <Text appearance="hint">Accuracy:</Text>
            <Text category="h5">
              {sessionStats.studied > 0 
                ? Math.round((sessionStats.correct / sessionStats.studied) * 100)
                : 0}%
            </Text>
          </View>
        </Card>
        <Button onPress={() => navigation.goBack()}>
          Back to Deck
        </Button>
      </Layout>
    );
  }

  if (!currentCard) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading cards...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        title="Study Session"
        accessoryLeft={BackAction}
      />
      
      <Layout style={{ flex: 1, padding: 16 }}>
        {/* Progress */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text category="s2">Progress</Text>
            <Text appearance="hint">
              {sessionStats.studied} / {sessionCards.length}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            status="primary"
          />
        </View>

        {/* Stats Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <Text category="h6">{remainingCards}</Text>
            <Text appearance="hint" category="c1">Remaining</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text category="h6" status="success">{sessionStats.correct}</Text>
            <Text appearance="hint" category="c1">Correct</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text category="h6" status="danger">{sessionStats.incorrect}</Text>
            <Text appearance="hint" category="c1">Incorrect</Text>
          </View>
        </View>

        {/* Flashcard */}
        <AnimatedFlashcard
          front={currentCard.front}
          back={currentCard.back}
          showAnswer={showAnswer}
          onPress={() => setShowAnswer(!showAnswer)}
          style={{ marginBottom: 20 }}
        />

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          {!showAnswer ? (
            <Button size="large" onPress={() => setShowAnswer(true)}>
              Show Answer
            </Button>
          ) : (
            <>
              <Text category="s2" style={{ textAlign: 'center', marginBottom: 8 }}>
                How difficult was this card?
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  status="danger"
                  style={{ flex: 1 }}
                  onPress={() => handleReview(ReviewQuality.AGAIN)}
                >
                  Again
                </Button>
                <Button
                  status="warning"
                  style={{ flex: 1 }}
                  onPress={() => handleReview(ReviewQuality.HARD)}
                >
                  Hard
                </Button>
                <Button
                  status="info"
                  style={{ flex: 1 }}
                  onPress={() => handleReview(ReviewQuality.GOOD)}
                >
                  Good
                </Button>
                <Button
                  status="success"
                  style={{ flex: 1 }}
                  onPress={() => handleReview(ReviewQuality.EASY)}
                >
                  Easy
                </Button>
              </View>
              <Text appearance="hint" category="c1" style={{ textAlign: 'center', marginTop: 8 }}>
                Next review: Based on your response
              </Text>
            </>
          )}
        </View>
      </Layout>
    </Layout>
  );
};