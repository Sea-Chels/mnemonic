import React from 'react';
import { Pressable, ViewStyle, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@ui-kitten/components';

interface WorkingGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
  intensity?: number;
  borderRadius?: number;
}

export const WorkingGlassCard: React.FC<WorkingGlassCardProps> = ({
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.4 : 0.15,
    shadowRadius: 16,
    ...style,
  };

  const glassContent = (
    <View style={{ position: 'relative' }}>
      {/* Background blur layer */}
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Semi-transparent overlay for glass effect */}
      <View style={{
        backgroundColor: isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(255, 255, 255, 0.25)',
        borderRadius,
        borderWidth: 1,
        borderColor: isDark 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'rgba(255, 255, 255, 0.4)',
        padding: 16,
      }}>
        {children}
      </View>
    </View>
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