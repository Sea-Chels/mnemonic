import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DecksStack } from './DecksStack';
import { StudyStack } from './StudyStack';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { RootTabParamList } from './types';
import { FloatingGlassTabBar } from '../ui/components/Glass/FloatingGlassTabBar';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_CONFIG = [
  { name: 'Decks', title: 'Decks', iconName: 'folder' as const },
  { name: 'Study', title: 'Study', iconName: 'book' as const },
  { name: 'Settings', title: 'Settings', iconName: 'settings' as const },
];

export const TabNavigator: React.FC = () => {
  const CustomTabBar = (props: any) => (
    <FloatingGlassTabBar {...props} tabs={TAB_CONFIG} />
  );

  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Decks" component={DecksStack} />
      <Tab.Screen name="Study" component={StudyStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};