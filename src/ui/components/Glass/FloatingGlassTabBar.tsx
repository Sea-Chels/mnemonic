import React from 'react';
import { View } from 'react-native';
import { BottomNavigation, BottomNavigationTab, useTheme } from '@ui-kitten/components';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingGlassTabBarProps {
  navigation: any;
  state: any;
  tabs: Array<{
    name: string;
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
  }>;
}

export const FloatingGlassTabBar: React.FC<FloatingGlassTabBarProps> = ({
  navigation,
  state,
  tabs,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme['color-primary-100'] === '#1A1A1A';

  const createIconComponent = (iconName: keyof typeof Ionicons.glyphMap) => {
    return (props: any) => {
      const isSelected = state.index === tabs.findIndex(tab => tab.iconName === iconName);
      return (
        <Ionicons
          name={iconName}
          size={24}
          color={
            isSelected 
              ? theme['color-primary-500']
              : isDark 
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.6)'
          }
        />
      );
    };
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: insets.bottom + 20, // Float above bottom safe area
      left: 20,
      right: 20,
      height: 60,
      borderRadius: 30, // Perfect pill shape
      overflow: 'hidden',
      elevation: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.6 : 0.3,
      shadowRadius: 25,
    }}>
      <BlurView
        intensity={35}
        tint={isDark ? 'dark' : 'light'}
        style={{ flex: 1 }}
      >
        {/* Glass morphism overlay */}
        <View style={{
          flex: 1,
          backgroundColor: isDark 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(255, 255, 255, 0.35)',
          borderWidth: 1,
          borderColor: isDark 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(255, 255, 255, 0.5)',
          borderRadius: 30,
        }}>
          <BottomNavigation
            selectedIndex={state.index}
            onSelect={index => navigation.navigate(state.routeNames[index])}
            style={{
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              paddingHorizontal: 20,
              height: '100%',
            }}
          >
            {tabs.map((tab, index) => (
              <BottomNavigationTab
                key={tab.name}
                title={tab.title}
                icon={createIconComponent(tab.iconName)}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 20,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </BottomNavigation>
        </View>
      </BlurView>
    </View>
  );
};