import React from 'react';
import { View } from 'react-native';
import { Layout, Text, Card, Button, Toggle, Spinner } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../stores/themeStore';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useImportExport } from '../../hooks/useImportExport';
import { GradientBackground } from '../../ui/components/Gradient';
import { EnhancedCard } from '../../ui/components/Enhanced';

export const SettingsScreen: React.FC = () => {
  const { mode, setTheme, toggleTheme } = useThemeStore();
  const { isInitialized, error } = useDatabase();
  const { isProcessing, exportAll, importAll } = useImportExport();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <GradientBackground variant="subtle">
        <Layout style={{ flex: 1, padding: 16, paddingTop: 60, backgroundColor: 'transparent' }}>
        <Text category="h1" style={{ marginBottom: 24 }}>Settings</Text>
      
      <EnhancedCard style={{ marginBottom: 16 }}>
        <Text category="h6" style={{ marginBottom: 12 }}>Theme</Text>
        <Text appearance="hint" style={{ marginBottom: 16 }}>
          Current theme: {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <Button 
            size="small"
            appearance={mode === 'light' ? 'filled' : 'outline'}
            onPress={() => setTheme('light')}
            style={{ flex: 1 }}
          >
            Light
          </Button>
          <Button 
            size="small"
            appearance={mode === 'dark' ? 'filled' : 'outline'}
            onPress={() => setTheme('dark')}
            style={{ flex: 1 }}
          >
            Dark
          </Button>
          <Button 
            size="small"
            appearance={mode === 'custom' ? 'filled' : 'outline'}
            onPress={() => setTheme('custom')}
            style={{ flex: 1 }}
          >
            Custom
          </Button>
        </View>
      </EnhancedCard>

      <EnhancedCard style={{ marginBottom: 16 }}>
        <Text category="h6" style={{ marginBottom: 12 }}>Database Status</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View 
            style={{ 
              width: 10, 
              height: 10, 
              borderRadius: 5, 
              backgroundColor: isInitialized ? '#52C41A' : '#FF4D4F',
              marginRight: 8 
            }} 
          />
          <Text appearance="hint">
            {isInitialized ? 'Connected' : error || 'Not connected'}
          </Text>
        </View>
      </EnhancedCard>

      <EnhancedCard style={{ marginBottom: 16 }}>
        <Text category="h6" style={{ marginBottom: 12 }}>Data Management</Text>
        <View style={{ gap: 8 }}>
          <Button
            appearance="outline"
            onPress={exportAll}
            disabled={isProcessing}
            accessoryLeft={isProcessing ? () => <Spinner size="small" /> : undefined}
          >
            {isProcessing ? 'Exporting...' : 'Export All Decks'}
          </Button>
          <Button
            appearance="outline"
            onPress={importAll}
            disabled={isProcessing}
            accessoryLeft={isProcessing ? () => <Spinner size="small" /> : undefined}
          >
            {isProcessing ? 'Importing...' : 'Import Decks'}
          </Button>
        </View>
        <Text appearance="hint" category="c1" style={{ marginTop: 12 }}>
          Export your decks as JSON or import from backup files
        </Text>
      </EnhancedCard>

      <EnhancedCard>
        <Text category="h6" style={{ marginBottom: 12 }}>About</Text>
        <Text appearance="hint">Mnemonic - Flashcard Learning App</Text>
        <Text appearance="hint" category="c1">Version 1.0.0</Text>
      </EnhancedCard>
        </Layout>
      </GradientBackground>
    </SafeAreaView>
  );
};