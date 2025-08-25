import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@ui-kitten/components';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'subtle' | 'medium' | 'accent';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  variant = 'subtle',
}) => {
  const theme = useTheme();
  const isDark = theme['color-primary-100'] === '#1A1A1A';

  const getGradientColors = () => {
    switch (variant) {
      case 'subtle':
        return isDark 
          ? [
              theme['color-primary-100'],
              theme['color-primary-200'] + '20',
              theme['color-primary-100'],
            ]
          : [
              theme['color-primary-100'] || '#F0F9FF',
              theme['color-primary-200'] + '30',
              '#FFFFFF',
            ];
      case 'medium':
        return isDark
          ? [
              theme['color-primary-100'],
              theme['color-primary-300'] + '15',
              theme['color-primary-200'] + '10',
              theme['color-primary-100'],
            ]
          : [
              theme['color-primary-100'] || '#F0F9FF',
              theme['color-primary-200'] + '40',
              theme['color-primary-300'] + '20',
              '#FFFFFF',
            ];
      case 'accent':
        return isDark
          ? [
              theme['color-primary-100'],
              theme['color-primary-400'] + '10',
              theme['color-primary-300'] + '15',
              theme['color-primary-100'],
            ]
          : [
              theme['color-primary-100'] || '#F0F9FF',
              theme['color-primary-300'] + '30',
              theme['color-primary-200'] + '40',
              '#FFFFFF',
            ];
      default:
        return [theme['color-primary-100'], '#FFFFFF'];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};