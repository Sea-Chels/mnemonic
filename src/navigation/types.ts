export type RootTabParamList = {
  Decks: undefined;
  Study: undefined;
  Settings: undefined;
};

export type DecksStackParamList = {
  DecksList: undefined;
  DeckDetail: { deckId: number };
  CreateDeck: undefined;
};

export type StudyStackParamList = {
  StudyHome: undefined;
  StudySession: { deckId: number };
  StudyStats: undefined;
};