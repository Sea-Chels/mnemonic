import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, useTheme } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { TabNavigator } from './src/navigation/TabNavigator';
import { DatabaseProvider } from './src/contexts/DatabaseContext';
import { useThemeStore } from './src/stores/themeStore';

const lightTheme = require('./src/ui/theme/light-theme.json');
const darkTheme = require('./src/ui/theme/dark-theme.json');
const vibrantTheme = require('./src/ui/theme/vibrant-theme.json');

const ThemedApp: React.FC = () => {
  const theme = useTheme();
  const themeMode = useThemeStore((state) => state.mode);

  return (
    <View style={{ flex: 1, backgroundColor: theme['color-primary-100'] }}>
      <NavigationContainer 
        theme={{
          dark: themeMode === 'dark',
          colors: {
            primary: theme['color-primary-500'],
            background: theme['color-primary-100'],
            card: theme['color-primary-100'],
            text: theme['text-basic-color'] || '#000000',
            border: theme['color-primary-200'],
            notification: theme['color-primary-500'],
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <TabNavigator />
      </NavigationContainer>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor={theme['color-primary-100']} />
    </View>
  );
};

export default function App() {
  const themeMode = useThemeStore((state) => state.mode);
  
  const getTheme = () => {
    switch (themeMode) {
      case 'dark':
        return { ...eva.dark, ...darkTheme };
      case 'custom':
        return { ...eva.light, ...vibrantTheme };
      default:
        return { ...eva.light, ...lightTheme };
    }
  };

  return (
    <SafeAreaProvider>
      <ApplicationProvider {...eva} theme={getTheme()}>
        <DatabaseProvider>
          <ThemedApp />
        </DatabaseProvider>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
}
