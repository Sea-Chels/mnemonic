import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@ui-kitten/components';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
  opacity?: number;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  style,
  intensity,
  borderRadius = 16,
  opacity,
}) => {
  const theme = useTheme();
  const isDark = theme['color-primary-100'] === '#1A1A1A';
  
  // Use theme values or fallbacks
  const blurIntensity = intensity || theme['glass-blur-intensity'] || 25;
  const glassOpacity = opacity || theme['glass-opacity-light'] || (isDark ? 0.15 : 0.25);
  const borderOpacity = theme['glass-border-opacity'] || (isDark ? 0.2 : 0.3);
  
  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]}>
      <BlurView
        intensity={blurIntensity}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flex: 1,
          backgroundColor: isDark 
            ? `rgba(255, 255, 255, ${glassOpacity * 0.6})` 
            : `rgba(255, 255, 255, ${glassOpacity})`,
        }}
      >
        <View style={{
          flex: 1,
          borderRadius,
          borderWidth: 1,
          borderColor: isDark 
            ? `rgba(255, 255, 255, ${borderOpacity})` 
            : `rgba(255, 255, 255, ${borderOpacity * 1.5})`,
          backgroundColor: 'transparent',
        }}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};