import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DecksStack } from './DecksStack';
import { StudyStack } from './StudyStack';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3366FF',
        tabBarInactiveTintColor: '#8F9BB3',
      }}
    >
      <Tab.Screen 
        name="Decks" 
        component={DecksStack}
        options={{
          tabBarLabel: 'Decks',
        }}
      />
      <Tab.Screen 
        name="Study" 
        component={StudyStack}
        options={{
          tabBarLabel: 'Study',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};