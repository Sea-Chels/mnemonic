import React from 'react';
import { Pressable, ViewStyle, View } from 'react-native';
import { Card, useTheme } from '@ui-kitten/components';

interface EnhancedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  style,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme();
  const isDark = theme['color-primary-100'] === '#1A1A1A';
  
  const cardStyle: ViewStyle = {
    borderRadius: 20,
    elevation: 8,
    shadowColor: isDark ? '#000' : theme['color-primary-900'] || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: isDark 
      ? theme['color-primary-200'] 
      : theme['color-primary-200'],
    ...style,
  };

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
        style={cardStyle}
      >
        <Card style={{ borderRadius: 20, borderWidth: 0, elevation: 0, shadowOpacity: 0 }}>
          {children}
        </Card>
      </Pressable>
    );
  }

  return (
    <Card style={cardStyle}>
      {children}
    </Card>
  );
};