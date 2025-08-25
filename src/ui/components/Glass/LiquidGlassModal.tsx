import React from 'react';
import { Modal as RNModal, View, ViewStyle, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@ui-kitten/components';

interface LiquidGlassModalProps {
  visible: boolean;
  onBackdropPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const LiquidGlassModal: React.FC<LiquidGlassModalProps> = ({
  visible,
  onBackdropPress,
  children,
  style,
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
      {/* Blurred backdrop */}
      <BlurView
        intensity={25}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        {/* Additional dark overlay for better contrast */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }} />
        
        <Pressable 
          style={{ flex: 1, width: '100%' }} 
          onPress={onBackdropPress}
        />
        
        {/* Glass modal content */}
        <View style={[
          {
            width: '90%',
            maxWidth: 400,
            borderRadius: 24,
            overflow: 'hidden',
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.6 : 0.3,
            shadowRadius: 32,
          },
          style,
        ]}>
          <BlurView
            intensity={35}
            tint={isDark ? 'dark' : 'light'}
            style={{ flex: 1 }}
          >
            <View style={{
              flex: 1,
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.3)',
              borderWidth: 1,
              borderColor: isDark 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.5)',
              borderRadius: 24,
              padding: 20,
            }}>
              {children}
            </View>
          </BlurView>
        </View>
        
        <Pressable 
          style={{ flex: 1, width: '100%' }} 
          onPress={onBackdropPress}
        />
      </BlurView>
    </RNModal>
  );
};