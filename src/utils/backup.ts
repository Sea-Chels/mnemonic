import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { ExportData } from './importExport';

const BACKUP_KEYS = {
  AUTO_BACKUP: 'auto_backup_enabled',
  LAST_BACKUP: 'last_backup_date',
  BACKUP_FREQUENCY: 'backup_frequency', // daily, weekly, monthly
  THEME_SETTINGS: 'theme_settings',
  USER_PREFERENCES: 'user_preferences',
};

export interface BackupData extends ExportData {
  settings: {
    theme: string;
    autoBackup: boolean;
    backupFrequency: string;
    lastBackup?: string;
  };
  userPreferences: {
    studyReminders: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    dailyGoal: number;
  };
}

/**
 * Create a complete backup including decks, flashcards, and settings
 */
export async function createCompleteBackup(
  exportData: ExportData,
  themeMode: string
): Promise<BackupData> {
  try {
    // Get settings from AsyncStorage
    const autoBackup = await AsyncStorage.getItem(BACKUP_KEYS.AUTO_BACKUP);
    const backupFrequency = await AsyncStorage.getItem(BACKUP_KEYS.BACKUP_FREQUENCY);
    const lastBackup = await AsyncStorage.getItem(BACKUP_KEYS.LAST_BACKUP);

    const backupData: BackupData = {
      ...exportData,
      version: '1.0.0',
      settings: {
        theme: themeMode,
        autoBackup: autoBackup === 'true',
        backupFrequency: backupFrequency || 'weekly',
        lastBackup: lastBackup || undefined,
      },
      userPreferences: {
        studyReminders: true,
        soundEnabled: true,
        vibrationEnabled: true,
        dailyGoal: 20,
      },
    };

    // Save backup timestamp
    await AsyncStorage.setItem(BACKUP_KEYS.LAST_BACKUP, new Date().toISOString());

    return backupData;
  } catch (error) {
    console.error('Backup creation error:', error);
    throw new Error('Failed to create complete backup');
  }
}

/**
 * Restore from complete backup
 */
export async function restoreFromBackup(backupData: BackupData): Promise<void> {
  try {
    // Restore settings
    await AsyncStorage.setItem(
      BACKUP_KEYS.AUTO_BACKUP,
      backupData.settings.autoBackup.toString()
    );
    await AsyncStorage.setItem(
      BACKUP_KEYS.BACKUP_FREQUENCY,
      backupData.settings.backupFrequency
    );
    
    if (backupData.settings.lastBackup) {
      await AsyncStorage.setItem(
        BACKUP_KEYS.LAST_BACKUP,
        backupData.settings.lastBackup
      );
    }

    // TODO: Restore theme settings to Zustand store
    // TODO: Restore user preferences
    
  } catch (error) {
    console.error('Backup restore error:', error);
    throw new Error('Failed to restore from backup');
  }
}

/**
 * Check if auto backup is due
 */
export async function isAutoBackupDue(): Promise<boolean> {
  try {
    const autoBackup = await AsyncStorage.getItem(BACKUP_KEYS.AUTO_BACKUP);
    const lastBackup = await AsyncStorage.getItem(BACKUP_KEYS.LAST_BACKUP);
    const frequency = await AsyncStorage.getItem(BACKUP_KEYS.BACKUP_FREQUENCY);

    if (autoBackup !== 'true' || !lastBackup) {
      return false;
    }

    const lastBackupDate = new Date(lastBackup);
    const now = new Date();
    const daysSinceBackup = Math.floor(
      (now.getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (frequency) {
      case 'daily':
        return daysSinceBackup >= 1;
      case 'weekly':
        return daysSinceBackup >= 7;
      case 'monthly':
        return daysSinceBackup >= 30;
      default:
        return false;
    }
  } catch (error) {
    console.error('Auto backup check error:', error);
    return false;
  }
}

/**
 * Get backup statistics
 */
export async function getBackupStats(): Promise<{
  hasAutoBackup: boolean;
  lastBackupDate?: Date;
  frequency: string;
  nextBackupDue?: Date;
}> {
  try {
    const autoBackup = await AsyncStorage.getItem(BACKUP_KEYS.AUTO_BACKUP);
    const lastBackup = await AsyncStorage.getItem(BACKUP_KEYS.LAST_BACKUP);
    const frequency = await AsyncStorage.getItem(BACKUP_KEYS.BACKUP_FREQUENCY);

    const stats = {
      hasAutoBackup: autoBackup === 'true',
      frequency: frequency || 'weekly',
      lastBackupDate: lastBackup ? new Date(lastBackup) : undefined,
      nextBackupDue: undefined as Date | undefined,
    };

    if (stats.lastBackupDate) {
      const nextBackup = new Date(stats.lastBackupDate);
      switch (stats.frequency) {
        case 'daily':
          nextBackup.setDate(nextBackup.getDate() + 1);
          break;
        case 'weekly':
          nextBackup.setDate(nextBackup.getDate() + 7);
          break;
        case 'monthly':
          nextBackup.setMonth(nextBackup.getMonth() + 1);
          break;
      }
      stats.nextBackupDue = nextBackup;
    }

    return stats;
  } catch (error) {
    console.error('Backup stats error:', error);
    return {
      hasAutoBackup: false,
      frequency: 'weekly',
    };
  }
}

/**
 * Configure auto backup settings
 */
export async function configureAutoBackup(
  enabled: boolean,
  frequency: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<void> {
  try {
    await AsyncStorage.setItem(BACKUP_KEYS.AUTO_BACKUP, enabled.toString());
    await AsyncStorage.setItem(BACKUP_KEYS.BACKUP_FREQUENCY, frequency);
  } catch (error) {
    console.error('Auto backup configuration error:', error);
    throw new Error('Failed to configure auto backup');
  }
}