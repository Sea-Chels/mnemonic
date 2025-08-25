import React from 'react';
import { Modal as RNModal, View, ViewStyle, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@ui-kitten/components';

interface GlassModalProps {
  visible: boolean;
  onBackdropPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  visible,
  onBackdropPress,
  children,
  style,
  intensity = 30,
  borderRadius = 24,
}) => {
  const theme = useTheme();
  const isDark = theme['color-primary-100'] === '#1A1A1A';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onBackdropPress}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <Pressable 
          style={{ flex: 1, width: '100%' }} 
          onPress={onBackdropPress}
        />
        
        <View style={[
          {
            width: '90%',
            maxWidth: 400,
            borderRadius,
            overflow: 'hidden',
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.4 : 0.2,
            shadowRadius: 24,
            backgroundColor: isDark 
              ? theme['color-primary-100'] 
              : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark 
              ? theme['color-primary-200'] 
              : theme['color-primary-300'],
          },
          style,
        ]}>
          {children}
        </View>
        
        <Pressable 
          style={{ flex: 1, width: '100%' }} 
          onPress={onBackdropPress}
        />
      </View>
    </RNModal>
  );
};