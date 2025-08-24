import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Deck, Flashcard } from '../database/types';

export interface ExportData {
  version: string;
  exportDate: string;
  decks: (Deck & { flashcards: Flashcard[] })[];
}

/**
 * Export decks and flashcards to JSON file
 */
export async function exportDecks(
  decks: Deck[],
  getFlashcardsForDeck: (deckId: number) => Promise<Flashcard[]>
): Promise<void> {
  try {
    // Prepare export data
    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      decks: [],
    };

    // Add flashcards to each deck
    for (const deck of decks) {
      const flashcards = await getFlashcardsForDeck(deck.id);
      exportData.decks.push({
        ...deck,
        flashcards,
      });
    }

    // Create file
    const fileName = `mnemonic-export-${Date.now()}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(exportData, null, 2),
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Export Flashcard Decks',
      });
    }

    // Clean up
    await FileSystem.deleteAsync(filePath, { idempotent: true });
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export decks');
  }
}

/**
 * Import decks and flashcards from JSON file
 */
export async function importDecks(): Promise<ExportData | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.type === 'cancel') {
      return null;
    }

    const fileContent = await FileSystem.readAsStringAsync(result.uri);
    const importData: ExportData = JSON.parse(fileContent);

    // Validate import data
    if (!importData.version || !importData.decks || !Array.isArray(importData.decks)) {
      throw new Error('Invalid import file format');
    }

    return importData;
  } catch (error) {
    console.error('Import error:', error);
    throw new Error('Failed to import decks');
  }
}

/**
 * Export deck to CSV format for spreadsheet apps
 */
export async function exportDeckToCSV(
  deck: Deck,
  flashcards: Flashcard[]
): Promise<void> {
  try {
    // Create CSV content
    let csvContent = 'Front,Back,Difficulty,Interval,Repetitions,Next Review\n';
    
    flashcards.forEach(card => {
      const row = [
        `"${card.front.replace(/"/g, '""')}"`,
        `"${card.back.replace(/"/g, '""')}"`,
        card.difficulty,
        card.interval,
        card.repetitions,
        card.next_review_date,
      ].join(',');
      csvContent += row + '\n';
    });

    // Create file
    const fileName = `${deck.name.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: `Export ${deck.name}`,
      });
    }

    // Clean up
    await FileSystem.deleteAsync(filePath, { idempotent: true });
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to export deck to CSV');
  }
}

/**
 * Import flashcards from CSV
 */
export async function importFromCSV(): Promise<{ front: string; back: string }[] | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/csv',
      copyToCacheDirectory: true,
    });

    if (result.type === 'cancel') {
      return null;
    }

    const fileContent = await FileSystem.readAsStringAsync(result.uri);
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    // Skip header if present
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('front') || firstLine.includes('question');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const cards: { front: string; back: string }[] = [];
    
    dataLines.forEach(line => {
      const matches = line.match(/(".*?"|[^,]+)/g);
      if (matches && matches.length >= 2) {
        const front = matches[0].replace(/^"|"$/g, '').replace(/""/g, '"');
        const back = matches[1].replace(/^"|"$/g, '').replace(/""/g, '"');
        if (front && back) {
          cards.push({ front: front.trim(), back: back.trim() });
        }
      }
    });

    return cards;
  } catch (error) {
    console.error('CSV import error:', error);
    throw new Error('Failed to import from CSV');
  }
}