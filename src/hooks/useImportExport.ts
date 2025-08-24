import { useState } from 'react';
import { Alert } from 'react-native';
import { useDatabase } from '../contexts/DatabaseContext';
import { useDecks } from './decks/useDecks';
import { useFlashcards } from './flashcards/useFlashcards';
import { exportDecks, importDecks, exportDeckToCSV, importFromCSV } from '../utils/importExport';
import { Deck } from '../database/types';

export const useImportExport = () => {
  const { db } = useDatabase();
  const { decks, createDeck, refreshDecks } = useDecks();
  const { createFlashcard } = useFlashcards();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportAll = async () => {
    if (!db) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      setIsProcessing(true);

      const getFlashcardsForDeck = async (deckId: number) => {
        const result = await db.getAllAsync(
          'SELECT * FROM flashcards WHERE deck_id = ?',
          [deckId]
        );
        return result;
      };

      await exportDecks(decks, getFlashcardsForDeck);
      Alert.alert('Success', 'Decks exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Failed to export decks. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportAll = async () => {
    if (!db) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      setIsProcessing(true);
      const importData = await importDecks();
      
      if (!importData) {
        return; // User cancelled
      }

      let importedDecks = 0;
      let importedCards = 0;

      for (const deckData of importData.decks) {
        try {
          // Create deck (without original ID)
          const deckId = await createDeck(
            deckData.name,
            deckData.description,
            deckData.color
          );

          // Import flashcards
          for (const card of deckData.flashcards) {
            await createFlashcard(deckId, card.front, card.back);
            importedCards++;
          }

          importedDecks++;
        } catch (error) {
          console.warn(`Failed to import deck: ${deckData.name}`, error);
        }
      }

      await refreshDecks();
      Alert.alert(
        'Import Complete',
        `Imported ${importedDecks} decks with ${importedCards} cards.`
      );
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Import Failed', 'Failed to import decks. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportDeckCSV = async (deck: Deck) => {
    if (!db) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      setIsProcessing(true);
      
      const flashcards = await db.getAllAsync(
        'SELECT * FROM flashcards WHERE deck_id = ?',
        [deck.id]
      );

      await exportDeckToCSV(deck, flashcards);
      Alert.alert('Success', `${deck.name} exported to CSV!`);
    } catch (error) {
      console.error('CSV export error:', error);
      Alert.alert('Export Failed', 'Failed to export deck to CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportCSV = async (deckId: number) => {
    if (!db) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      setIsProcessing(true);
      const cards = await importFromCSV();
      
      if (!cards) {
        return; // User cancelled
      }

      let importedCount = 0;
      for (const card of cards) {
        try {
          await createFlashcard(deckId, card.front, card.back);
          importedCount++;
        } catch (error) {
          console.warn('Failed to import card:', error);
        }
      }

      Alert.alert('Import Complete', `Imported ${importedCount} cards from CSV.`);
    } catch (error) {
      console.error('CSV import error:', error);
      Alert.alert('Import Failed', 'Failed to import from CSV. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    exportAll: handleExportAll,
    importAll: handleImportAll,
    exportDeckCSV: handleExportDeckCSV,
    importCSV: handleImportCSV,
  };
};