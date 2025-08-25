import React from 'react';
import { Pressable, ViewStyle, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@ui-kitten/components';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
  intensity?: number;
  borderRadius?: number;
  opacity?: number;
  elevation?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  onLongPress,
  intensity = 25,
  borderRadius = 20,
  opacity = 0.2,
  elevation = 8,
}) => {
  const theme = useTheme();
  const isDark = theme['color-primary-100'] === '#1A1A1A';
  
  const glassStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    elevation,
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 12,
    ...style,
  };

  // Try to use BlurView with fallback
  let content;
  try {
    content = (
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flex: 1,
          backgroundColor: isDark 
            ? `rgba(255, 255, 255, ${opacity * 0.6})` 
            : `rgba(255, 255, 255, ${opacity})`,
        }}
      >
        <View style={{
          flex: 1,
          borderRadius,
          borderWidth: 1,
          borderColor: isDark 
            ? `rgba(255, 255, 255, ${opacity * 2})` 
            : `rgba(255, 255, 255, ${opacity * 4})`,
          backgroundColor: 'transparent',
          padding: 16,
        }}>
          {children}
        </View>
      </BlurView>
    );
  } catch (error) {
    // Fallback to solid card if blur fails
    content = (
      <View style={{
        flex: 1,
        borderRadius,
        borderWidth: 1,
        borderColor: isDark 
          ? theme['color-primary-200'] 
          : theme['color-primary-300'],
        backgroundColor: isDark 
          ? theme['color-primary-100'] 
          : '#FFFFFF',
        padding: 16,
      }}>
        {children}
      </View>
    );
  }

  if (onPress || onLongPress) {
    return (
      <Pressable
        style={glassStyle}
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={glassStyle}>
      {content}
    </View>
  );
};