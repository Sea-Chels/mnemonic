import React from 'react';
import { Pressable, ViewStyle, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@ui-kitten/components';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
  intensity?: number;
  borderRadius?: number;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  onPress,
  onLongPress,
  intensity = 25,
  borderRadius = 20,
}) => {
  const theme = useTheme();
  const isDark = theme['color-primary-100'] === '#1A1A1A';
  
  const containerStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.4 : 0.2,
    shadowRadius: 20,
    ...style,
  };

  const glassContent = (
    <BlurView
      intensity={intensity}
      tint={isDark ? 'dark' : 'light'}
      style={{
        flex: 1,
      }}
    >
      {/* Glass morphism overlay */}
      <View style={{
        flex: 1,
        backgroundColor: isDark 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(255, 255, 255, 0.25)',
        borderWidth: 1,
        borderColor: isDark 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.4)',
        borderRadius,
        padding: 16,
      }}>
        {children}
      </View>
    </BlurView>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable
        style={containerStyle}
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{ 
          color: 'rgba(255, 255, 255, 0.1)',
          borderless: false,
        }}
      >
        {glassContent}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle}>
      {glassContent}
    </View>
  );
};