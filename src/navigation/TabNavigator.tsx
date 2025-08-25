import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, useTheme } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { DecksStack } from './DecksStack';
import { StudyStack } from './StudyStack';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const DecksIcon = (props: any) => (
  <Ionicons name="folder" size={24} color={props.tintColor || '#8F9BB3'} />
);

const StudyIcon = (props: any) => (
  <Ionicons name="book" size={24} color={props.tintColor || '#8F9BB3'} />
);

const SettingsIcon = (props: any) => (
  <Ionicons name="settings" size={24} color={props.tintColor || '#8F9BB3'} />
);

export const TabNavigator: React.FC = () => {
  const theme = useTheme();
  
  const BottomTabBar = ({ navigation, state }: any) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}
      style={{
        paddingTop: 10,
        paddingBottom: 25,
        paddingHorizontal: 20,
        backgroundColor: theme['color-primary-100'],
        borderTopWidth: 1,
        borderTopColor: theme['color-primary-200'],
        elevation: 20,
        shadowColor: theme['color-primary-300'],
        shadowOffset: {
          width: 0,
          height: -5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}
    >
      <BottomNavigationTab 
        title='Decks' 
        icon={DecksIcon}
        style={{
          borderRadius: 15,
          marginHorizontal: 8,
        }}
      />
      <BottomNavigationTab 
        title='Study' 
        icon={StudyIcon}
        style={{
          borderRadius: 15,
          marginHorizontal: 8,
        }}
      />
      <BottomNavigationTab 
        title='Settings' 
        icon={SettingsIcon}
        style={{
          borderRadius: 15,
          marginHorizontal: 8,
        }}
      />
    </BottomNavigation>
  );

  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Decks" component={DecksStack} />
      <Tab.Screen name="Study" component={StudyStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};