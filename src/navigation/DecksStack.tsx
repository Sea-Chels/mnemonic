import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DecksListScreen } from '../screens/Decks/DecksListScreen';
import { DeckDetailScreen } from '../screens/Decks/DeckDetailScreen';
import { DecksStackParamList } from './types';

const Stack = createStackNavigator<DecksStackParamList>();

export const DecksStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DecksList" component={DecksListScreen} />
      <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
    </Stack.Navigator>
  );
};