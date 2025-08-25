import React from 'react';
import { View } from 'react-native';
import { BottomNavigation, BottomNavigationTab, useTheme } from '@ui-kitten/components';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface GlassTabBarProps {
  navigation: any;
  state: any;
  tabs: Array<{
    name: string;
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
  }>;
}

export const GlassTabBar: React.FC<GlassTabBarProps> = ({
  navigation,
  state,
  tabs,
}) => {
  const theme = useTheme();
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
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      overflow: 'hidden',
      elevation: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 20,
      backgroundColor: theme['color-primary-100'],
      borderTopWidth: 1,
      borderTopColor: theme['color-primary-200'],
    }}>
          <BottomNavigation
            selectedIndex={state.index}
            onSelect={index => navigation.navigate(state.routeNames[index])}
            style={{
              paddingTop: 10,
              paddingBottom: 25,
              paddingHorizontal: 20,
              backgroundColor: 'transparent',
              borderTopWidth: 0,
            }}
          >
            {tabs.map((tab, index) => (
              <BottomNavigationTab
                key={tab.name}
                title={tab.title}
                icon={createIconComponent(tab.iconName)}
                style={{
                  borderRadius: 15,
                  marginHorizontal: 8,
                  backgroundColor: state.index === index 
                    ? isDark 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.2)'
                    : 'transparent',
                }}
              />
            ))}
          </BottomNavigation>
    </View>
  );
};