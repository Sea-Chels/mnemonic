import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { TabNavigator } from './src/navigation/TabNavigator';
import { DatabaseProvider } from './src/contexts/DatabaseContext';
import { useThemeStore } from './src/stores/themeStore';

const lightTheme = require('./src/ui/theme/light-theme.json');
const darkTheme = require('./src/ui/theme/dark-theme.json');
const vibrantTheme = require('./src/ui/theme/vibrant-theme.json');

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
    <ApplicationProvider {...eva} theme={getTheme()}>
      <DatabaseProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      </DatabaseProvider>
    </ApplicationProvider>
  );
}
