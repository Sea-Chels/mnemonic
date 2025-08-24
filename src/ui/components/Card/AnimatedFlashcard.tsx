import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Card, Text } from '@ui-kitten/components';

interface AnimatedFlashcardProps {
  front: string;
  back: string;
  showAnswer: boolean;
  onPress: () => void;
  style?: any;
}

export const AnimatedFlashcard: React.FC<AnimatedFlashcardProps> = ({
  front,
  back,
  showAnswer,
  onPress,
  style,
}) => {
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withTiming(showAnswer ? 180 : 0, { duration: 600 });
  }, [showAnswer]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotateValue.value, [0, 180], [0, 180]);
    const opacity = interpolate(rotateValue.value, [0, 90, 180], [1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotateValue.value, [0, 180], [180, 360]);
    const opacity = interpolate(rotateValue.value, [0, 90, 180], [0, 0, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <Pressable onPress={onPress} style={[{ position: 'relative' }, style]}>
      <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, frontAnimatedStyle]}>
        <Card style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 300 
        }}>
          <Text category="s2" appearance="hint" style={{ marginBottom: 12 }}>
            Question
          </Text>
          <Text category="h4" style={{ textAlign: 'center' }}>
            {front}
          </Text>
          <Text appearance="hint" category="c1" style={{ marginTop: 20 }}>
            Tap to reveal answer
          </Text>
        </Card>
      </Animated.View>

      <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, backAnimatedStyle]}>
        <Card style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 300 
        }}>
          <Text category="s2" appearance="hint" style={{ marginBottom: 12 }}>
            Answer
          </Text>
          <Text category="h4" style={{ textAlign: 'center' }}>
            {back}
          </Text>
        </Card>
      </Animated.View>

      {/* Invisible card to maintain layout */}
      <Card style={{ 
        opacity: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 300 
      }}>
        <Text category="h4">placeholder</Text>
      </Card>
    </Pressable>
  );
};