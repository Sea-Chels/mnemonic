import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StudyHomeScreen } from '../screens/Study/StudyHomeScreen';
import { StudySessionScreen } from '../screens/Study/StudySessionScreen';
import { StudyStackParamList } from './types';

const Stack = createStackNavigator<StudyStackParamList>();

export const StudyStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudyHome" component={StudyHomeScreen} />
      <Stack.Screen name="StudySession" component={StudySessionScreen} />
    </Stack.Navigator>
  );
};