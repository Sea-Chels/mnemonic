import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { TabNavigator } from './src/navigation/TabNavigator';
import { DatabaseProvider } from './src/contexts/DatabaseContext';
import { useThemeStore } from './src/stores/themeStore';

export default function App() {
  const themeMode = useThemeStore((state) => state.mode);
  
  const getTheme = () => {
    switch (themeMode) {
      case 'dark':
        return eva.dark;
      case 'custom':
        return eva.dark; // Use dark for now
      default:
        return eva.light;
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
