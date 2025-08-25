import React, { useEffect } from 'react';
import { Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Card, Text, useTheme } from '@ui-kitten/components';

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
  const theme = useTheme();
  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const shadowValue = useSharedValue(8);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    rotateValue.value = withTiming(showAnswer ? 180 : 0, { 
      duration: 800, 
      easing: Easing.out(Easing.cubic),
    });
  }, [showAnswer]);

  const handlePress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Scale animation
    scaleValue.value = withTiming(0.95, { duration: 100 }, (finished) => {
      if (finished) {
        scaleValue.value = withTiming(1, { duration: 100 });
      }
    });
    
    // Shadow animation
    shadowValue.value = withTiming(16, { duration: 200 }, (finished) => {
      if (finished) {
        shadowValue.value = withTiming(8, { duration: 300 });
      }
    });
    
    onPress();
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
      { perspective: 1000 },
    ],
  }));

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotateValue.value, [0, 180], [0, 180]);
    const opacity = interpolate(rotateValue.value, [0, 90, 180], [1, 0, 0]);
    const translateZ = interpolate(rotateValue.value, [0, 90, 180], [0, 50, 0]);
    
    return {
      transform: [
        { rotateY: `${rotateY}deg` },
        { translateZ },
      ],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotateValue.value, [0, 180], [180, 360]);
    const opacity = interpolate(rotateValue.value, [0, 90, 180], [0, 0, 1]);
    const translateZ = interpolate(rotateValue.value, [0, 90, 180], [0, 50, 0]);
    
    return {
      transform: [
        { rotateY: `${rotateY}deg` },
        { translateZ },
      ],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    shadowRadius: shadowValue.value,
    shadowOpacity: interpolate(shadowValue.value, [8, 16], [0.1, 0.2]),
    elevation: shadowValue.value,
  }));

  const cardStyle = {
    flex: 1, 
    justifyContent: 'center' as const, 
    alignItems: 'center' as const,
    minHeight: 300,
    borderRadius: 20,
  };

  const enhancedCardStyle = {
    ...cardStyle,
    shadowColor: theme['color-primary-900'] || '#000',
    shadowOffset: { width: 0, height: 4 },
  };

  return (
    <Animated.View style={[containerAnimatedStyle, shadowAnimatedStyle, style]}>
      <Pressable onPress={handlePress} style={{ position: 'relative' }}>
        <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, frontAnimatedStyle]}>
          <Card style={enhancedCardStyle}>
            <Text category="s2" appearance="hint" style={{ marginBottom: 12 }}>
              Question
            </Text>
            <Text category="h4" style={{ textAlign: 'center', paddingHorizontal: 20 }}>
              {front}
            </Text>
            <Text appearance="hint" category="c1" style={{ marginTop: 20 }}>
              Tap to reveal answer
            </Text>
          </Card>
        </Animated.View>

        <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, backAnimatedStyle]}>
          <Card style={enhancedCardStyle}>
            <Text category="s2" appearance="hint" style={{ marginBottom: 12 }}>
              Answer
            </Text>
            <Text category="h4" style={{ textAlign: 'center', paddingHorizontal: 20 }}>
              {back}
            </Text>
            <Text appearance="hint" category="c1" style={{ marginTop: 20, opacity: 0.7 }}>
              Tap to flip back
            </Text>
          </Card>
        </Animated.View>

        {/* Invisible card to maintain layout */}
        <Card style={{ 
          opacity: 0, 
          ...cardStyle,
        }}>
          <Text category="h4">placeholder</Text>
        </Card>
      </Pressable>
    </Animated.View>
  );
};